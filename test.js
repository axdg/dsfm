const parser = require('./');
const assert = require('assert');
const stream = require('readable-stream');

describe('parser()', function () {
  it('should return a Function instance,', function () {
    assert(parser('') instanceof Function);
  });

  it('should deal with arbitrary delimiters,', function () {
    const csfm = new parser(',,,', function (data) {
      return data.replace('dash', 'comma');
    });

    let ret = csfm(',,,\ndash-seperated\n,,,\ncontent');
    assert.equal(ret.attributes, 'comma-seperated');
    assert.equal(ret.body, 'content');

    // No newline after closing delim (eos)
    const bsfm = parser(['[[[', ']]]'], function (data) {
      return data.replace('dash', 'square-bracket');
    });

    ret = bsfm('[[[\ndash-seperated\n]]]');
    assert.equal(ret.attributes, 'square-bracket-seperated');
    assert.equal(ret.body, '');
  });

  it('even when constructed without a transform', function () {
    const csfm = new parser(',,,');
    const ret = csfm(',,,\ndata\n,,,\ncontent');

    assert.equal(ret.attributes, 'data');
    assert.equal(ret.body, 'content');
  });

  it('should throw on invalid delimiters type', function () {
    assert.throws(function () { new parser({}); });
  });

  it('should throw on invalid fn type', function () {
    assert.throws(function () { new parser('', 2); });
  });

  /**
   * Testing yaml() and json() is an appropriate
   * test for return values of the parser
   * constructor, given arbitrary args.
   */
  describe('#yaml()', function () {
    it('should correctly parse a document', function () {
      const post = parser.yaml('---\ntesting: true\npassing: hopefully\n---\ncontent');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal(post.body, 'content');
    });

    it('should parse a document using dos newlines', function () {
      const post = parser.yaml('---\r\ntesting: true\r\npassing: hopefully\r\n---\r\ncontent');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal(post.body, 'content');
    });

    it('should parse a document containing no front-matter', function () {
      const post = parser.yaml('content');
      assert.equal(post.attributes, null);
      assert.equal(post.body, 'content');
    });

    it('should parse a document containing only front-matter', function () {
      const post = parser.yaml('---\ntesting: true\npassing: hopefully\n---\n');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal(post.body, '');
    });

    it('should parse an empty document', function () {
      const post = parser.yaml('');
      assert.equal(post.attributes, null);
      assert.equal(post.body, '');
    });

    describe('#test()', function () {
      it('should test for yaml front-matter in a document', function () {
        const test = parser.yaml.test;
        assert(test('---\ntesting: true\npassing: hopefully\n---\ncontent'));
        assert(!test('no-front-matter'));
      });
    });

    describe('#through()', function () {
      const through = parser.yaml.through();
      it('should return `through` stream', function () {
        assert(through instanceof stream.Transform);
      });

      it('that emits `attributes` and `data`', function (complete) {
        let attributes;
        let body = '';

        const readable = new stream.Readable({
          read: function () {
            this.push('---\ntesting: true\npassing: hopefully\n---\ncontent');
            this.push(null);
          },
        });

        through.on('attributes', function (attr) {
          attributes = attr;
        });

        through.on('data', function (data) {
          body += data;
        });

        through.on('end', function () {
          assert(attributes, { testing: true, passing: 'hopefully' });
          assert(body, 'content');
          complete();
        });

        readable.pipe(through);
      });
    });
  });

  describe('#json()', function () {
    it('should correctly parse a document', function () {
      const post = parser.json('{{{\n"testing":true,"passing":"hopefully"\n}}}\ncontent');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal('content', post.body);
    });

    it('should parse a document using dos newlines', function () {
      const post = parser.json('{{{\r\n"testing":true,"passing":"hopefully"\r\n}}}\r\ncontent');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal(post.body, 'content');
    });

    it('should parse a document containing no front-matter', function () {
      const post = parser.json('content');
      assert.equal(post.attributes, null);
      assert.equal(post.body, 'content');
    });

    it('should parse a document containing only front-matter', function () {
      const post = parser.json('{{{\n"testing":true,"passing":"hopefully"\n}}}\n');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal(post.body, '');
    });

    it('should parse an empty document', function () {
      const post = parser.json('');
      assert.equal(post.attributes, null);
      assert.equal(post.body, '');
    });

    describe('#test()', function () {
      it('should test for json front-matter in a document', function () {
        const test = parser.json.test;
        assert(test('{{{\n"testing":true,"passing":"hopefully"\n}}}\ncontent'));
        assert(!test('no-front-matter'));
      });
    });

    describe('#through()', function () {
      const through = parser.json.through();
      it('should return `through` stream', function () {
        assert(through instanceof stream.Transform);
      });

      it('that emits `attributes` and `data`', function (complete) {
        let attributes;
        let body = '';

        const readable = new stream.Readable({
          read: function () {
            this.push('{{{\n"testing":true,"passing":"hopefully"\n}}}\ncontent');
            this.push(null);
          },
        });

        through.on('attributes', function (attr) {
          attributes = attr;
        });

        through.on('data', function (data) {
          body += data;
        });

        through.on('end', function () {
          assert.deepEqual(attributes, { testing: true, passing: 'hopefully' });
          assert.deepEqual(body, 'content');
          complete();
        });

        readable.pipe(through);
      });
    });
  });
});
