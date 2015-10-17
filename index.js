'use strict';

var merge = require('merge');
var SwaggerParser = require('swagger-parser');

var DEFAULT_OPTIONS = {
  validate: {
    spec: true,
  },
  $refs: {
    internal: false,
  },
};

module.exports = function swaggerizeDocs(docs, options) {
  var mergedOptions = merge.recursive(true, DEFAULT_OPTIONS, options);

  return SwaggerParser.validate(docs, mergedOptions);
};
