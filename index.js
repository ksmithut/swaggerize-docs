'use strict';

var path            = require('path');
var merge           = require('merge');
var readYaml        = require('./lib/read-yaml');
var globAsync       = require('./lib/glob-async');
var validateSwagger = require('./lib/validate-swagger');

var DEFAULT_CONFIG = {
  swagger: '2.0',
  info: {
    title: process.env.npm_package_name,
    description: process.env.npm_package_description
  },
  produces: ['application/json']
};

/**
 * compileDocs
 * This is what gets exported. It gets the api docs, merges in the default
 * config, the found api docs, and the given options into one object to be
 * validated with swagger
 */
function compileDocs(dir, options) {
  options = options || {};

  var apiDocOptions = merge(true, {
    definitionsDir: '_definitions',
    pathsDir: ''
  }, options);

  delete options.definitionsDir;
  delete options.pathsDir;

  return getApiDocs(dir, apiDocOptions)
    .then(function (api) {
      return merge.recursive(true,
        DEFAULT_CONFIG,
        api,
        options
      );
    })
    .then(validateSwagger);
}

/**
 * compileDocs.versions
 * This is just a wrapper around compileDocs that makes making a versioned api
 * with separate documentation super easy.
 */
compileDocs.versions = function (dir, options) {
  options = options || {};
  var versionPattern = options.versionPattern || 'v*';
  delete options.versionPattern;

  return globAsync(versionPattern + '/', {cwd: dir})
    .reduce(function (versions, version) {
      var versionPath = '/' + version
        .split(path.sep)
        .filter(function (a) { return !!a; })
        .join('/');
      var versionDir = path.join(dir, version);
      var versionOptions = merge(true, {basePath: versionPath}, options);
      var versionKey = version.substr(0, version.length - 1);
      return compileDocs(versionDir, versionOptions).then(function (api) {
        versions[versionKey] = api;
        return versions;
      });
    }, {});
};

/**
 * getApiDocs
 * This gets all of the definitions from all of the yaml files in the given
 * directory. This does not do any swagger validation
 */
function getApiDocs(dir, options) {
  var api;
  return globAsync('index.{yaml,yml}', {cwd: dir})
    .then(function (files) {
      if (!files.length) { throw new Error('index.yaml/.yml not found'); }
      return readYaml(dir, files[0]);
    })
    .then(function (baseApi) {
      api = baseApi;
      return getPaths(path.resolve(dir, options.pathsDir));
    })
    .then(function (paths) {
      api.paths = paths;
      return getDefinitions(path.resolve(dir, options.definitionsDir));
    })
    .then(function (definitions) {
      api.definitions = definitions;
      return api;
    });
}

/**
 * getDefinitions
 * Loads all of the api endpoint yaml definitions and returns the `definitions`
 * object that gets put into the swagger json file
 */
function getDefinitions(dir) {
  return globAsync('*.{yaml,yml}', {cwd: dir})
    .reduce(function (definitions, filepath) {
      var name = path.basename(filepath, path.extname(filepath));
      return readYaml(dir, filepath).then(function (definitionObj) {
        definitions[name] = definitionObj;
        return definitions;
      });
    }, {});
}

/**
 * getPaths
 * Loads all of the api endpoint yaml definitions and returns the `paths` object
 * that gets put into the swagger json file
 */
function getPaths(dir) {
  return globAsync('**/*.{yaml,yml}', {
    cwd: dir,
    ignore: ['index.yaml', '_definitions/**']
  }).reduce(function (paths, filepath) {
    var url = filepath
      .replace(/\.ya?ml$/, '')
      .split(path.sep)
      .join('/');
    return readYaml(dir, filepath).then(function (pathObj) {
      paths['/' + url] = pathObj;
      return paths;
    });
  }, {});
}

module.exports = compileDocs;
