'use strict';

var supertest = require('supertest');
var simple    = require('../examples/simple/app');
var chai      = require('chai');
var expect    = chai.expect;

describe('swaggerize-docs', function () {

  describe('simple example', function () {
    var users = require('../examples/simple/users.json');
    var request;
    before(function () {
      return simple.then(function (app) {
        request = supertest.agent(app);
      });
    });

    it('GET /users', function (done) {
      request.get('/users')
        .expect(200)
        .expect(users)
        .end(done);
    });

    it('GET /users/0', function (done) {
      request.get('/users/0')
        .expect(200)
        .expect(users[0])
        .end(done);
    });

    it('POST /users', function (done) {
      request.post('/users')
        .send({
          email: 'testing@testing.com',
          firstName: 'MyFirstName',
          lastName: 'MyLastName',
          password: 'mytestpassword'
        })
        .expect(201)
        .end(done);
    });

    it('PUT /users/2', function (done) {
      request.put('/users/2')
        .send({
          email: 'testing@testing.com',
          firstName: 'MyFirstNameEdited',
          lastName: 'MyLastName'
        })
        .expect(204)
        .end(done);
    });

    it('DELETE /users/2', function (done) {
      request.delete('/users/2')
        .expect(204)
        .end(done);
    });

  });

});
