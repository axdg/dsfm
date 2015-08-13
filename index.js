var parser = require('js-yaml');

var matter = {};

/**
 * parse
 */
_this = function(string) {

  string = trimBOM(string) || '';

  // default case no front matter empty ouput object
  var o = {
    data: null,
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
  if (c == -1) return o;

  flen = f.length + 1;
  data = string.slice(flen, c);
  o.data = parser.load(data);
  o.content = string.slice(string.indexOf('\n', c + 1)).replace('\n', '');
  return o;
}

/**
 * test
 */
_this.test = function(string) {

  string = trimBOM(string) || '';

  var f = /^---\r?\n/.test(string),
      c = /\n---\r?\n/.test(string);

  return f && c;
}

// al
_this.parse = function(string) {
  return _this(string);
}

// convenience method for the export
function matter(string) {
   return matter.parse(string)
}

function trimBOM(string) {
  if (string.charAt(0) === '\uFEFF') {
    string = string.slice(1);
  }
  return string;
}

module.exports = _this;
