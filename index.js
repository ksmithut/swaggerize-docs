'use strict';

var BPromise = require('bluebird');
var path     = require('path');
var fs       = require('fs');
var glob     = require('glob');
var yaml     = require('js-yaml');
var merge    = require('merge');
var parser   = require('swagger-parser');

var DEFAULT_CONFIG = {
  swagger: '2.0',
  info: {
    title: process.env.npm_package_name,
    description: process.env.npm_package_description
  },
  produces: ['application/json']
};

module.exports = function compileDocs(dir, options) {
  options = options || {};
  var definitionsDir = options.definitionsDir || '_definitions';
  var pathsDir = options.pathsDir || '';
  delete options.definitionsDir;
  delete options.pathsDir;

  return getApiDocs(dir, {
    definitionsDir: definitionsDir,
    pathsDir: pathsDir
  })
    .then(function (api) {
      return merge.recursive(true,
        DEFAULT_CONFIG,
        api,
        options
      );
    })
    .then(validateSwagger);
};

function getApiDocs(dir, options) {
  var api;
  return globAsync('index.{yaml,yml}', dir)
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

function getDefinitions(dir) {
  return globAsync('*.{yaml,yml}', dir)
    .reduce(function (definitions, filepath) {
      var name = path.basename(filepath, path.extname(filepath));
      return readYaml(dir, filepath).then(function (definitionObj) {
        definitions[name] = definitionObj;
        return definitions;
      });
    }, {});
}

function getPaths(dir) {
  return globAsync('**/*.{yaml,yml}', dir)
    .filter(function (filepath) {
      var isIndex = filepath === 'index.yaml';
      var isDefinition = filepath.indexOf('_definitions') === 0;
      return !isIndex && !isDefinition;
    })
    .reduce(function (paths, filepath) {
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

function readYaml() {
  var paths = Array.prototype.slice.call(arguments);
  var filepath = path.join.apply(null, paths);
  return readFileAsync(filepath).then(function (contents) {
    return yaml.safeLoad(contents);
  });
}

function readFileAsync(filepath) {
  return BPromise.fromNode(fs.readFile.bind(null, filepath, 'utf8'));
}

function globAsync(pattern, cwd) {
  return BPromise.fromNode(glob.bind(null, pattern, {cwd: cwd}));
}

function validateSwagger(api) {
  return new BPromise(function (resolve, reject) {
    parser.parse(api, function (err, validatedApi) {
      if (err) { return reject(err); }
      resolve(validatedApi);
    });
  });
}
