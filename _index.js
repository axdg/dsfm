/**
 * module dependancies
 */
var yaml = require('js-yaml');

/**
 *
 * @param {String|Array} delims
 * @param {Function} [fn]
 */
function Parser(delims, fn) {

  if(!this instanceof Parser) {
    return new Parser(delims, fn)
  }

  fn = fn || noop;
  if(typeof fn !== 'function') {
    throw new TypeError() // Error?
  }
  if(!Array.isArray(delims)) {
    delims = [delims];
  } else if(!delims.length) {
    throw new TypeError() // Error?
  }

  var o = new RegExp('^\\uFEFF?' + delims[0] + '\\r?\\n');
  var c = new Regexp('\\n' + (delims[1] || delims[0]) + '\\r?\\n');

  /**
   *
   * @param {String} str
   */
  this = function(str) {

    var out = {
      attributes: {},
      body: str
    }

    if(!o.test(str)) {
      return out;
    }

    var end = str.search(c);

    if(end === -1) {
      return out;
    }

    // slice out and parse the front matter
    out.attributes = fn(string.slice(string.indexOf('\n') + 1, end));

    // slice out the body
    out.body = string.slice(string.indexOf('\n', end) + 1);
    return out;
  }

  /**
   *
   * @param {String} str
   */
  this.test = function(str) {
    return o.test(str) && c.test(str);
  }
}

function noop(str) {
  return str;
}

var fm = new Parser('---', yaml.safeLoad);

// default aliases dsfm.yaml
module.exports = fm;

// expose parser
module.exports.Parser = Parser;

// expose yaml and json front matter
module.exports.yaml = fm;
module.exports.json = new Parser(['{{{', '}}}'], function(str) {
  JSON.parse('{' + str + '}');
});


