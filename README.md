# swaggerize-docs

[![io.js compatibility](https://img.shields.io/badge/io.js-compatible-brightgreen.svg?style=flat)](https://iojs.org/)
[![node.js compatibility](https://img.shields.io/badge/node.js-compatible-brightgreen.svg?style=flat)](https://nodejs.org/)

[![NPM version](http://img.shields.io/npm/v/swaggerize-docs.svg?style=flat)](https://www.npmjs.org/package/swaggerize-docs)
[![Dependency Status](http://img.shields.io/david/ksmithut/swaggerize-docs.svg?style=flat)](https://david-dm.org/ksmithut/swaggerize-docs)
[![Dev Dependency Status](http://img.shields.io/david/dev/ksmithut/swaggerize-docs.svg?style=flat)](https://david-dm.org/ksmithut/swaggerize-docs#info=devDependencies&view=table)
[![Code Climate](http://img.shields.io/codeclimate/github/ksmithut/swaggerize-docs.svg?style=flat)](https://codeclimate.com/github/ksmithut/swaggerize-docs)
[![Build Status](http://img.shields.io/travis/ksmithut/swaggerize-docs/master.svg?style=flat)](https://travis-ci.org/ksmithut/swaggerize-docs)
[![Coverage Status](http://img.shields.io/codeclimate/coverage/github/ksmithut/swaggerize-docs.svg?style=flat)](https://codeclimate.com/github/ksmithut/swaggerize-docs)

A complimentary swagger api docs that works especially well in conjunction with
[`swaggerize-express`](https://github.com/krakenjs/swaggerize-express).

# Installation

```bash
npm install swaggerize-docs --save
```

You should also read up on the [Swagger spec](http://swagger.io/).

# Usage

This module is quite involved and requires you to set up your folder structure
in a certain way. The best way to explain it is by example:

See [examples](https://github.com/ksmithut/swaggerize-docs/tree/master/examples/)

Basically, it builds out your swagger documentation by reading your folder
structure and automagically combining them.

You should have a folder dedicated to your swagger docs. In the examples, I use
the `docs/` folder. Next, you should have in that folder an `index.yaml` with
your top level swagger properties. It could look something like this:

(Note that any `.yaml` file extension can be replaced with `.yml`. Whatever you
choose to do, just be consistent.)

```yaml
swagger: '2.0'
info:
  title: My API
  description: This is my API
  version: '1.0.0'
host: myhost.com
schemes:
  - https
basePath: /v1
produces:
  - application/json
```

You don't have to include all of that. The default values are these:

```yaml
swagger: '2.0'
info:
  title: # the npm package name in your package.json if you used npm start or another npm command
  description: # the npm package description in your package.json if you used npm start or another npm command
  version: # The npm package version in your package.json if you used npm start or another npm command
produces:
  - application/json
```

If you don't start your app with an npm command, then you will need to proved
the required `info` properties. Or you can just explicitly define them like you
should anyway.

Next, in that docs folder, you should have another folder called `_definitions`.
Every `.yaml` file in that directory (not subdirectories) will be attached to
the `definitions` property.

For example, if you have a `User.yaml` in your `_definitions` folder, and
`User.yaml` looks like this:

```yaml
properties:
  email:
    type: string
    description: The user's unique email
  firstName:
    type: string
    description: The user's first name
  lastName:
    type: string
    description: The user's last name
```

...it will be attached to the `definitions` property of the swagger api docs
like this:

```json
{
  "definitions": {
    "User": {
      "properties": {
        "email": {"type": "string", "description": "The user's unique email"},
        "firstName": {"type": "string", "description": "The user's first name"},
        "lastName": {"type": "string", "description": "The user's last name"}
      }
    }
  }
}
```

and can be used as a swagger `$ref` in `#/definitions/User`.

As for your paths, the paths get automatically loaded in much like how
`swaggerize-express` does it. If you have a `users.yaml` file in your docs
directory, it will be loaded as:

```json
{
  "paths": {
    "/users": {}
  }
}
```

and if you have a `users/{id}.yaml` file in your docs directory, it will be
loaded as:

```json
{
  "paths": {
    "/users/{id}": {}
  }
}
```

Everything get combined and validated through a swagger validator.

# API Configuration

```js
var path = require('path');
var docs = require('swaggerize-docs');

// The folder path must be an absolute path
var docsPath = path.join(__dirname, 'docs');
// any other properties put on this object get put directly onto the swagger api doc object
var docsOptions = {
  definitionsDir: '_definitions', // The relative path to the definitions directory (relative to above path)
  pathsDir: '' // The relative path to where the paths will be read from. Default is the root. This will ignore files in the definitionsDir.
};

docs(docsPath, docsOptions)
  .then(function (api) {

  })
  .catch(function (err) {
    // most likely swaggerize validation error
  });
```
