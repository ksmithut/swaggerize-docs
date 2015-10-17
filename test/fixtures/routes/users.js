// routes/users.js
'use strict';

var User = require('../models/user');

module.exports = {
  get: function(req, res, next) {
    User.find()
      .then(function(users) {
        res.json(users);
      })
      .catch(next);
  },
};
