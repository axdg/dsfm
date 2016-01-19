var yaml = require('js-yaml'),

/**
 * parse()
 *
 * @private
 */
function parse() {

}

/**
 * test()
 *
 * @private
 */
function test() {

}

/**
 * transformStream()
 *
 * @private
 */
function transformStream() {

}

/**
 * newParser() returns a new post-parsing function
 * that constructs an object from a post and parses
 * front-matter or content with the given parsers
 * TODO: this is a private method, docs should be @ post-parser.newParser()
 *
 * @param {String} delim
 * @param {Function} dataParser
 * @param {Function} contentParser
 * @returns {Function}
 */
function newParser(delim, dataParser, contentParser) {

  // type check delim
  if (typeof delim !== 'string') {
    throw new TypeError('newParser expects a string as the delimiter');
  }

  // regular expressions for delim location
  _this.regExps = {
    opening: new RegExp('^' + delim + '\r?\n'),
    closing: new RegExp('\n' + delim + '\r?\n')
  }

  // determine the front matter parser
  if (!dataParser && typeof dataParser === 'undefined') {
    _this.dataParser = yaml.Load;
  } else (typeof dataParser === 'function') {
    _this.dataParser = dataParser;
  }

  // HELP: error on object that is not null or a function?

  // _this.contentParser = contentParser ? contentParser : undefined
  _this.contentParser = contentParser;

  _return = parse.bind(_this);
  _return.test = parse.bind(_this);
  _return.transformStream = transformStream.bind(_this);

  return _return;
}
