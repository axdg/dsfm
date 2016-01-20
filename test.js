var dsfm = require('./')
    assert = require('assert');

describe('dsfm', function() {
  describe('#Parser()', function() {
    it('should create a Function instance,', function() {
      assert(new dsfm.Parser('') instanceof Function);
    });
    it('even when invoked without `new`,', function() {
      assert(dsfm.Parser('') instanceof Function);
    });
    it('should deal arbitrary delims,', function() {
      var csfm = new dsfm.Parser(',,,', function(data) {
        return data.replace('e', 'a');
      });
      var ret = csfm(',,,\ndate\n,,,\ncontent');
      assert.equal(ret.attributes, 'data');
      assert.equal(ret.body, 'content');
    });
    it('even when constructed without a transform', function() {
      var csfm = new dsfm.Parser(',,,', null);
      var ret = csfm(',,,\ndata\n,,,\ncontent');
          assert.equal(ret.attributes, 'data');
          assert.equal(ret.body, 'content');
    });
    it('should throw on invalid delims type', function() {
      assert.throws(function() { new dsfm.Parser({}) });
    });
    it('should throw on invalid fn type', function() {
      assert.throws(function() { new dsfm.Parser('', 2) });
    });
  });
  describe('#yaml()', function() {
    it('should parse yaml front-matter', function() {
      // assert.equal()
    });
  });
  describe('#json()', function() {
    it();
  });
});

// empty file
// front-matter and content
// no front-matter and content
// front-matter and no content
// no second delimiter
// no first delimiter
