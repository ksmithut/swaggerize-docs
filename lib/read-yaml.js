'use strict';

var Promise = require('bluebird');
var path    = require('path');
var yaml    = require('js-yaml');
var fs      = require('fs');

/**
 * readYaml
 * Read a yaml file given a filepath. The arguments get joined using path.join
 * so you can do something like `readYaml(__dirname, 'test', 'index.yaml')`
 * and the filepath will be /path/to/cur/dir/test/index.yaml
 */
module.exports = function readYaml() {
  var paths = Array.prototype.slice.call(arguments);
  var filepath = path.join.apply(null, paths);
  return readFileAsync(filepath).then(function (contents) {
    return yaml.safeLoad(contents);
  });
};

/**
 * readFileAsync
 * Promise version of fs.readFile, with the exception that it always uses the
 * utf8 encoding
 */
function readFileAsync(filepath) {
  return Promise.fromNode(fs.readFile.bind(null, filepath, 'utf8'));
}
