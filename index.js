var yaml = require('js-yaml');

// TODO: determine api for custom delims, front matter and body parsers
// TODO: expand comments

// This module really doesn't need to do anything but extract front matter, or build
// front matter given either a text file, or object respectively.



/**
 * parse
 */
dm = function(string) {

  string = trimByteOrderMark(string) || '';

  if (typeof(string) !== 'string') {
    throw new Error('dark-matter expects a string');
  }

  // default case no front matter empty ouput object
  var o = {
    data: {},
    content: string
  }

  // regex for the first line of the file
  var f = string.slice(0, string.indexOf('\n')), // splice out the first line
      p = /^---\r?/; // and validate it

  // no front matter detected, return the file as contents
  if (!p.test(f)) {
    return o;
  }

  // find the index of the closing delim or return the default object
  var c = string.search(/\n---\r?\n/);
  if (c === -1) return o;

  flen = f.length + 1;
  data = string.slice(flen, c);

  if (data) {
    o.data = dataParser.load(data);
  }

  o.content = string.slice(string.indexOf('\n', c + 1)).replace('\n', '');
  return o;
}

/**
 * test
 */
dm.test = function(string) {

  string = trimByteOrderMark(string) || '';

  var f = /^---\r?\n/.test(string),
      c = /\n---\r?\n/.test(string);

  return f && c;
}

// convinience alias
dm.parse = function(string) {
  return this(string);
}

function trimByteOrderMark(string, char) {
  if (string.charAt(0) === '\uFEFF') {
    string = string.slice(1);
  }
  return string;
}

module.exports = dm;
