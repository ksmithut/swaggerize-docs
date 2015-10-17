'use strict';

var path = require('path');
var Server = require('hyperbole');
var express = require('express');
var swaggerDocs = require('../../index');
var swagger = require('swaggerize-express');

var app = express();
var server = new Server(app);

var DOCS_PATH = path.join(__dirname, 'docs', 'main.yaml');
var ROUTES_PATH = path.join(__dirname, 'routes');

exports.app = app;

exports.default = swaggerDocs(DOCS_PATH)
  .then(function(api) {
    app.use(swagger({
      api: api,
      docspath: '/api-docs',
      handlers: ROUTES_PATH,
    }));
  })
  .then(server.start);
