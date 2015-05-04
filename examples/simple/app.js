'use strict';

var path = require('path');
var http = require('http');
var express = require('express');
var swaggerize = require('swaggerize-express');
var docs = require('../../');
var bodyParser = require('body-parser');
var app = express();
var server = http.createServer(app);

app.use(bodyParser.json());

module.exports = docs(path.join(__dirname, 'docs'))
  .then(function (api) {

    app.use(swaggerize({
      api: api,
      docspath: '/api-docs',
      handlers: './routes'
    }));

    app.use(function (req, res) {
      res.status(404).end();
    });

    server.listen(process.env.PORT || 8000, function () {
      console.log('server started');
    });

    return app;

  })
  .catch(function (err) {
    // Swagger validation errors will show up here
    console.log(err);
  });
