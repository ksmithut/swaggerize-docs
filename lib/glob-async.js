'use strict';

var Promise = require('bluebird');
var glob    = require('glob');

/**
 * globAsync
 * Promise version of glob
 */
function globAsync(pattern, options) {
  return Promise.fromNode(glob.bind(null, pattern, options));
}

globAsync.minimatch = glob.minimatch;

module.exports = globAsync;
