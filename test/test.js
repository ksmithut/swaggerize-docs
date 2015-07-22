'use strict';

var path      = require('path');
var supertest = require('supertest');
var chai      = require('chai');
var expect    = chai.expect;
var docs      = require('../');

describe('swaggerize-docs', function () {

  it('should catch error if index.yaml doesn\'t exist', function () {
    return docs(path.join(__dirname, 'fixtures', 'no-index'))
      .then(function () {
        throw new Error('Error should happen');
      })
      .catch(function (err) {
        expect(err.message).to.be.equal('index.yaml/.yml not found');
      });
  });

  it('should catch swaggerize validation errors', function () {
    return docs(path.join(__dirname, 'fixtures', 'fail-validation'))
      .then(function () {
        throw new Error('Error should happen');
      })
      .catch(function (err) {
        expect(err.message).to.include('Error in Swagger definition');
      });
  });

  describe('simple example', function () {
    var data = {
      users: require('../examples/simple/users.json'),
      request: null
    };
    before(function () {
      return require('../examples/simple/app').then(function (app) {
        data.request = supertest.agent(app);
      });
    });

    testApi('/users', data);

  });

  it('should include a file as a description if the "info.description" field is a path', function () {
    return docs(path.join(__dirname, 'fixtures', 'path-description'), { descriptionFile: 'README.md' })
      .then(function (api) {
        expect(api.info.description).to.be.equal('README.md');
      });
  });

});

function testApi(endpoint, data) {

  it('GET ' + endpoint, function (done) {
    data.request.get(endpoint)
      .expect(200)
      .expect(data.users)
      .end(done);
  });

  it('GET' + endpoint + '/0', function (done) {
    data.request.get(endpoint + '/0')
      .expect(200)
      .expect(data.users[0])
      .end(done);
  });

  it('GET' + endpoint + '/2', function (done) {
    data.request.get(endpoint + '/2')
      .expect(404)
      .end(done);
  });

  it('POST ' + endpoint, function (done) {
    data.request.post(endpoint)
      .send({
        email: 'testing@testing.com',
        firstName: 'MyFirstName',
        lastName: 'MyLastName',
        password: 'mytestpassword'
      })
      .expect(201)
      .end(done);
  });

  it('PUT ' + endpoint + '/2', function (done) {
    data.request.put(endpoint + '/2')
      .send({
        email: 'testing@testing.com',
        firstName: 'MyFirstNameEdited',
        lastName: 'MyLastName'
      })
      .expect(204)
      .end(done);
  });

  it('PUT ' + endpoint + '/3', function (done) {
    data.request.put(endpoint + '/3')
      .send({
        email: 'testing@testing.com',
        firstName: 'MyFirstNameEdited',
        lastName: 'MyLastName'
      })
      .expect(404)
      .end(done);
  });

  it('DELETE ' + endpoint + '/2', function (done) {
    data.request.delete(endpoint + '/2')
      .expect(204)
      .end(done);
  });

  it('DELETE ' + endpoint + '/2', function (done) {
    data.request.delete(endpoint + '/2')
      .expect(404)
      .end(done);
  });

}
