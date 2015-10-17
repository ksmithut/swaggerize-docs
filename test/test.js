'use strict';

var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var docs = require('../index');
var server = require('./fixtures/app');
var request = require('supertest-as-promised')(server.app);

var DOCS_PATH = path.join(__dirname, 'fixtures', 'docs', 'main.yaml');
var DOCS_JSON = require('./fixtures/docs.json');

describe('swaggerize-docs', function() {

  before(function() {
    return server.default;
  });

  it('should load the api', function() {
    return docs(DOCS_PATH).then(function(api) {
      expect(api).to.be.eql(DOCS_JSON);
    });
  });

  it('should use the api docs', function() {
    return request.get('/users').expect(200)
      .then(function() {
        return request.get('/users/0').expect(200);
      });
  });

});
