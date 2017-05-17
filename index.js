/**
 * Module dependancies.
 */
const stream = require('readable-stream');
const yaml = require('js-yaml');

/**
 * Constructs new front-matter parser
 * given delimiter(s) and an optional
 * function to transform the extracted
 * front-matter
 *
 * @param {String|Array} d
 * @param {Function} [fn]
 * @return {Function} new parser
 */
function parser(d, fn = noop) {
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');

  const isArray = Array.isArray(d);
  if (!isArray && typeof d !== 'string') {
    throw new TypeError('first argument must be a string or array');
  } else if (!isArray) {
    d = [d];
  } else if (!d.length) {
    throw new Error('first argument cannot be an empty array');
  }

  // Compile opening (`o`) and closing (`c`) RegExps.
  const o = new RegExp('^\uFEFF?' + escape(d[0]) + '\r?\n');
  const c = new RegExp('\n' + escape(d[1] || d[0]) + '(?:\r?\n|$)');

  /**
   * Test a string to determine
   * if it contains front-matter.
   *
   * @param {String}
   * @return {Boolean}
   */
  const _this = function (str = '') {
    const out = {
      attributes: null,
      body: str,
    };

    if (!o.test(str)) return out;

    const end = str.search(c);

    if (end === -1) return out;

    // Slice out and parse the front-matter.
    out.attributes = fn(str.slice(str.indexOf('\n') + 1, end));

    // Check if the body actually exists.
    const index = (str.indexOf('\n', end + 1) + 1);
    if (!index) {
      out.body = '';
      return out;
    }

    // Slice out the body.
    out.body = str.slice(str.indexOf('\n', end + 1) + 1);
    return out;
  };

  /**
   * Creates a through stream that
   * emits a single `attributes` event
   * once front-matter is parsed, then
   * simply re-emits body chunks
   *
   * @return {stream.Transform} through stream
   * @api private
   */
  _this.through = function () {
    const self = this; // Actually `_this` :)

    let data = '';
    let inDocumentBody = false;

    /**
     * NOTE: This could still be optimized
     * for where fron-matter doesn't exist
     * if no opening delim is encountered
     * the stream should begin emitting right away.
     */
    return new stream.Transform({
      transform: function (chunk, encoding, next) {
        if (!inDocumentBody) {
          data += String(chunk);
          try {
            const split = self(data);

           /**
            * If front matter was captured emit the
            * attributes event, push whatever remains.
            */
            if (split.attributes) {
              inDocumentBody = !inDocumentBody;
              this.emit('attributes', split.attributes);
              return next(null, split.body);
            }
          } catch (err) {
            next(err);
          }

          /**
           * make sure `str` could actually
           * contain a front-matter block,
           * if not, no need to accumulate chunks.
           */
          if (data.length > 6 && !o.test(data)) {
            inDocumentBody = !inDocumentBody;
            next(null, data);
          }
        } else {
          next(null, chunk);
        }
      },
      flush: function (done) {
        /**
         * worst case scenario; `str` began with an
         * opening delim, but the closing delim
         * does not exist, push all data to buffer
         */
        if (!inDocumentBody) {
          this.emit('attributes', null);
          this.push(data);
        }
        done();
      },
    });
  };

  /**
   * Test a string to determine
   * if it contains front-matter
   *
   * @param {String} str
   * @return {Boolean} front-matter?
   */
  _this.test = function (str) {
    return o.test(str) && c.test(str);
  };

  return _this;
}

/**
 * Escape user supplied delimiter.
 *
 * @param {String} str
 * @return {String} RegExp escaped string
 */
function escape(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Avoids a conditional where no
 * front-matter transform was provided
 *
 * @param {String} str
 * @return {String} noop on str
 */
function noop(str) {
  return str;
}

// The parser is the default export.
module.exports = parser;

// expose yaml and json front matter
module.exports.yaml = parser('---', yaml.safeLoad);
module.exports.json = parser(['{{{', '}}}'], function (str) {
  return JSON.parse('{' + str + '}');
});
