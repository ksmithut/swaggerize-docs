// routes/users/{id}.js
'use strict';

var User = require('../../models/user');

module.exports = {
  get: function(req, res, next) {
    User.findById(req.params.id)
      .then(function(user) {
        res.json(user);
      })
      .catch(next);
  },
};
