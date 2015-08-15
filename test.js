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

// a sample containing no front matter and no content
fixt.empty = {
  data: null,
  content: ''
}

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
  content: ''
}

// a sample containing no second delim
fixt.noSecondDelim = {
  data: null,
  content: '---\ncontent'
}

// a sample containing no first delim
fixt.noFirstDelim = {
  data: null,
  content: 'content\n---\n'
}

describe('fm', function() {

  describe('#test', function() {
    it('should detect front matter in a string', function() {
      assert.equal(true, fm.test('---\ntest: test\n---\ncontent'));
    });
    it('should detect front matter in a string beginning with a BOM', function() {
      assert.equal(true, fm.test('\uFEFF---\ntest: test\n---\ncontent'));
    });
  });

  describe('#parse', function() {
    it('should parse a string containing front matter', function() {
      assert.deepEqual(fixt.complete, fm.parse('---\ntest: test\n---\ncontent'));
    });
    it('should parse front matter from a string beginning with a BOM', function() {
      assert.deepEqual(fixt.complete, fm.parse('\uFEFF---\ntest: test\n---\ncontent'));
    });
    it('should correctly parse an empty string', function() {
      assert.deepEqual(fixt.empty, fm.parse(''));
    });
    it('should correctly parse a string containing no front matter block', function() {
      assert.deepEqual(fixt.noFrontMatter, fm.parse('content'));
    });
    it('should correctly parse a string containing an empty front matter block', function() {
      assert.deepEqual(fixt.noFrontMatter, fm.parse('---\n\n---\ncontent'));
    });
    it('should correctly parse a string containing no content', function() {
      assert.deepEqual(fixt.noContent, fm.parse('---\ntest: test\n---\n'))
    });
    it('should correctly parse a string containing only a front delim', function() {
      assert.deepEqual(fixt.noSecondDelim, fm.parse('---\ncontent'));
    });
    it('should correctly parse a string containing only a closing delim', function() {
      assert.deepEqual(fixt.noFirstDelim, fm.parse('content\n---\n'));
    });
    it('should correctly parse string using dos newlines', function() {
      assert.deepEqual(fixt.complete, fm.parse('---\r\ntest: test\r\n---\r\ncontent'));
    });
  });
});

describe('fm()', function() {
  it('should alias dm.parse()', function() {
    assert.deepEqual(fixt.complete, fm.parse('---\ntest: test\n---\ncontent'))
  });
});


