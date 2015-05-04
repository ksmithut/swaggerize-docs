'use strict';

var users = require('../../users');

module.exports = {
  get: function (req, res) {
    res.json(users);
  },
  post: function (req, res) {
    users.push(req.body);
    res.status(201).end();
  }
};
