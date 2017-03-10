# dsfm

> Parse documents containing Delimiter-Separated Front-Matter 

[![Build Status](https://travis-ci.org/axdg/dsfm.svg?branch=master)](https://travis-ci.org/axdg/dsfm) [![Coverage Status](https://coveralls.io/repos/github/axdg/dsfm/badge.svg?branch=master)](https://coveralls.io/github/axdg/dsfm?branch=master)

## Install

```
$ npm install --save dsfm
```

## Usage

The simplest use case is to parse documents containing yaml front-matter:

```js
var yamlfm = require('dsfm').yaml;

var post = yamlfm('---\ntitle: abc\n---\npost');
// => {attributes: {title: 'abc'}, body: 'post'}
```

or json front-matter:

```js
var jsonfm = require('dsfm').json;

var post = jsonfm('{{{\ntitle: abc\n}}}\npost');
// => {attributes: {title: 'abc'}, body: 'post'}
```

This can also generate custom document parsers, and parse streams of text (see below).

**Note:** So far as I know, there is no specification for front-matter (yaml or otherwise). This modules 'spec' defines front-matter as a block of text at the beginning of a string seperated by two delimiters, each on their own line. The opening delimiter must be the first thing in the string. The closing delimiter must be immediately followed by a newline character (or the end of the string).

## API

### dsfm(delimiters, [loader])

Constructs a new front-matter parser. See *`parser`* documentation below.

#### delimiters

Type: `string|array`

The delimter(s) used for front-matter. Where both delims are the same you can use a string, such as `'---'`. If the opening and closing delims are different, use an array such as `['{{{', '}}}']`

**Note:** The string(s) you provide will have any RegExp tokens escaped internally, so if you need to use backslashes inside delimiters, they must be escaped with another backslash. For example, the delimiter `\fm\` should be supplied as `\\fm\\`

#### loader

Type: `function`

An optional function to transform the front-matter after it is extracted. For example, `dsfm.yaml()` uses [js-yamls](https://github.com/nodeca/js-yaml)'s `safeload` and `dsfm.json()` uses `JSON.parse()`.

### *parser*(doc)

#### doc

Type: `string`

Parses the supplied doc and returns a `content` object of form `{ attributes: ..., body: ... }`.
If no front-matter is present, arrtibutes will be `null` and `body` body will contain the original string. Where the whole document is a front-matter block, attributes will be populated and the content will be an empty string `''`.

### *parser*.test(doc)

#### doc

Type: `string`

Test for the presence of front-matter in `doc`

### *parser*.through()

Returns a through / transform stream for parsing streaming documents. The stream will emit a single `attributes` event then start emitted `data` containing the document body.

```js
var fs = require('fs');
var yamlfm = require('dsfm').yaml;

var post = fs.createReadStream('./post.md')
      .pipe(yaml.through());

post.on('attributes', function(attr) {
  console.log(attr);
});
```

If no front-matter is present, the attributes payload will be `null`.

### dsfm.yaml

A parser for strings containing yaml front-matter, delimited by '---' and '---'. Generated internally using `dsfm('---', yaml.safeLoad)`. It also implements the `test(doc)` and `through()` methods.

### dsfm.json

A parser for strings containing json front-matter, delimited by '{{{' and '}}}'. Generated internally using:

```js
dsfm(['{{{', '}}}'], function (str) {
  return JSON.parse('{' + str + '}');
});
```

It also implements the `test(doc)` and `through()` methods.

**Note:** json front-matter is a set of object key-value pairs. Values may themselves be objects or arrays nested however deeply, but at the top level, it must be an object (not an array).

## License

MIT (c) 2016, axdg (<axdg@dfant.asia>).


