var fm = require('./')
    assert = require('assert');

var fixture = {
  data: {
    test: 'test'
  },
  content: 'content'
}

var fixt = [];

// sample containing both front-matter and content
fixt.complete = {
  data: {
    test: 'test'
  },
  content: 'content'
};

// a sample containing no front matter
fixt.noFrontMatter = {
  data: null,
  content: 'content'
}

// a sample containing no content
fixt.noContent = {
  data: {
    test: 'test'
  },
  content: null
}

describe('fm', function() {

  describe('#test', function() {
    it('should detect front matter in a string', function() {
      assert.equal(true, fm.test('---\ntest: test\n---\r\ncontent'));
    });
    it('should detect front matter in a string beginning with a BOM', function() {
      assert.equal(true, fm.test('\uFEFF---\ntest: test\n---\r\ncontent'));
    });
  });

  describe('#parse', function() {
    it('should parse a string containing front matter', function() {
      assert.deepEqual(fixt.complete, fm.parse('---\ntest: test\n---\r\ncontent'));
    });
    it('should parse front matter from a string beginning with a BOM', function() {
      assert.deepEqual(fixt.complete, fm.parse('\uFEFF---\ntest: test\n---\r\ncontent'));
    });

    // TODO: write these tests
    it('should correctly parse an empty string');
    it('should correctly parse a string containing no front matter');
    it('should correctly parse a string containing no content');
    it('should correctly parse a string containing only a front delim');
    it('should correctly parse a string containing only a closing delim');
    it('should correctly parse string using dos newlines')
  });
});

describe('fm()', function() {
  it('should correctly alias fm.parse()');
});


