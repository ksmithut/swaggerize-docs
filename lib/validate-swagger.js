'use strict';

var Promise = require('bluebird');
var parser  = require('swagger-parser');

/**
 * validateSwagger
 * Given a json swagger schema, this function validates it!
 */
module.exports = function validateSwagger(api) {
  return new Promise(function (resolve, reject) {
    parser.parse(api, function (err, validatedApi) {
      if (err) { return reject(err); }
      resolve(validatedApi);
    });
  });
};
