'use strict';

var Promise = require('bluebird');

var data = [{
  id: '0',
  email: 'test@email.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}];

module.exports = User;

function User() {}

User.find = function find() {
  return Promise.resolve(data);
};

User.findById = function findById(id) {
  var foundUser = data.filter(function(user) {
    return user.id === String(id);
  })[0];

  if (foundUser) { return Promise.resolve(foundUser); }
  return Promise.reject(new Error('User not found'));
};
