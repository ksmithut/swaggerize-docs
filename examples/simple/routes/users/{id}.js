'use strict';

var users = require('../../users');

module.exports = {
  get: function (req, res, next) {
    var user = users[req.params.id];
    if (user) { return res.json(user); }
    next();
  },
  put: function (req, res, next) {
    var user = users[req.params.id];
    if (user) {
      req.body.id = req.params.id;
      users[req.params.id] = req.body;
      return res.status(204).json(req.body);
    }
    next();
  },
  delete: function (req, res, next) {
    var user = users[req.params.id];
    if (user) {
      delete users[req.params.id];
      return res.status(204).end();
    }
    next();
  }
};
