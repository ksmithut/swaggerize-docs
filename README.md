# swaggerize-docs

[![NPM version](http://img.shields.io/npm/v/swaggerize-docs.svg?style=flat)](https://www.npmjs.org/package/swaggerize-docs)
[![Dependency Status](http://img.shields.io/david/ksmithut/swaggerize-docs.svg?style=flat)](https://david-dm.org/ksmithut/swaggerize-docs)
[![Dev Dependency Status](http://img.shields.io/david/dev/ksmithut/swaggerize-docs.svg?style=flat)](https://david-dm.org/ksmithut/swaggerize-docs#info=devDependencies&view=table)
[![Code Climate](http://img.shields.io/codeclimate/github/ksmithut/swaggerize-docs.svg?style=flat)](https://codeclimate.com/github/ksmithut/swaggerize-docs)
[![Build Status](http://img.shields.io/travis/ksmithut/swaggerize-docs/master.svg?style=flat)](https://travis-ci.org/ksmithut/swaggerize-docs)
[![Coverage Status](http://img.shields.io/codeclimate/coverage/github/ksmithut/swaggerize-docs.svg?style=flat)](https://codeclimate.com/github/ksmithut/swaggerize-docs)

A complimentary swagger api docs that works especially well in conjunction with
[`swaggerize-express`](https://github.com/krakenjs/swaggerize-express).

NOTE: pre 1.0 did it a completely different way. This now is just a wrapper
around [`swagger-parser`](https://github.com/BigstickCarpet/swagger-parser) with
some default options in place.

# Installation

```bash
npm install swaggerize-docs --save
```

You should also read up on the [Swagger spec](http://swagger.io/).

# Usage

In pre 1.0 versions, the directory structure was automatically loaded into your
`paths` property for your api docs. In this version, it leverages the path
dereferencing used by `swagger-parser`.

The following code snippets layout an app that looks like this:

```
project/
├─ app.js
├─ docs/
│  ├─ main.yaml
│  ├─ paths/
│  │  ├─ users.yaml
│  │  └─ users/
│  │     └─ {id}.yaml
│  └─ definitions/
│     └─ User.yaml
└─ routes/
   ├─ users.js
   └─ users/
      └─ {id}.js
```

```js
// app.js
'use strict';

var path = require('path');
var express = require('express');
var swagger = require('swaggerize-express');
var swaggerDocs = require('swaggerize-docs');
var app = express();

var DOCS_PATH = path.join(__dirname, 'docs', 'main.yaml');

swaggerDocs(DOCS_PATH).then(function(api) {
  app.use(swagger({
    api: api,
    docspath: '/api-docs'
    handlers: './routes'
  }));
  app.listen(8000, function() {
    console.log('server started');
  });
});
```

Documentation:

```yaml
# docs/main.yaml
swagger: '2.0'
info:
  title: My API
  description: 'My API description'
  version: 1.0.0
paths:
  /users:
    $ref: './paths/users.yaml'
  /users/{id}:
    $ref: './paths/users/{id}.yaml'
definitions:
  User:
    $ref: './definitions/User.yaml'
```

```yaml
# docs/paths/users.yaml
get:
  summary: List Users
  description: Gets a list of users
  responses:
    200:
      description: Success
      schema:
        type: array
        items:
          $ref: '#/definitions/User'
```

```yaml
# docs/paths/users/{id}.yaml
get:
  summary: Get a User
  description: Gets a single user by id
  parameters:
    - name: id
      in: path
      type: string
      required: true
      description: The Id of the user to get
  responses:
    200:
      description: Success
      schema:
        $ref: '#/definitions/User'
    404:
      description: Not Found
```

```yaml
# docs/definitions/User.yaml
properties:
  email:
    type: string
  createdAt:
    type: date
  updatedAt:
    type: date
```

Actual Routes:

```js
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
  }
};
```

```js
// routes/users/{id}.js
'use strict';

var User = require('../../models/user');

module.exports = {
  get: function(req, res, next) {
    User.findById(req.params.id)
      .then(function(user) {
        if (!user) { return res.sendStatus(404); }
        res.json(user);
      })
      .catch(next);
  }
};
```

# API Configuration

## `swaggerDocs(docs, options)`

* `docs` (String|Object) If a string is passed, it will read that as a filepath.
  If you pass on object, it will read that as your swagger docs object.

* `options` (Object) This is just the options object as documented
  [here](https://github.com/BigstickCarpet/swagger-parser/blob/master/docs/options.md)
