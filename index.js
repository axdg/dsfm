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
    throw new TypeError('fn must be a function');
  }

  var arr = Array.isArray(delims);
  if(!arr && typeof delims !== 'string') {
    throw new TypeError('delims must be a string or array');
  } else if(!arr) {
    delims = [delims];
  } else if(!delims.length) {
    throw new Error('delims cannot be an empty array');
  }

  var o = new RegExp('^\\uFEFF?' + escape(delims[0]) + '\\r?\\n');
  var c = new RegExp('\\n' + escape(delims[1] || delims[0]) + '\\r?\\n');

  /**
   *
   * @param {String} str
   */
  _this = function(str) {

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
    out.attributes = fn(str.slice(str.indexOf('\n') + 1, end));

    // slice out the body
    out.body = str.slice(str.indexOf('\n', end + 1) + 1);
    return out;
  }

  /**
   *
   * @param {String} str
   */
  _this.test = function(str) {
    return o.test(str) && c.test(str);
  }

  return _this;
}

function escape(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
module.exports.json = new Parser(['{{{', '}}}'], function(data) {
  JSON.parse('{' + str + '}');
});


