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
    it('that can deal arbitrary delims', function() {
      var csfm = new dsfm.Parser(',,,', function(data) {
        return data.replace('e', 'a');
      });
      var ret = csfm(',,,\ndate\n,,,\ncontent');
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


// var fixture = {
//   data: {
//     test: 'test'
//   },
//   content: 'content'
// }

// var fixt = [];

// // sample containing both front-matter and content
// fixt.complete = {
//   data: {
//     test: 'test'
//   },
//   content: 'content'
// };

// // a sample containing no front matter and no content
// fixt.empty = {
//   data: {},
//   content: ''
// }

// // a sample containing no front matter
// fixt.noFrontMatter = {
//   data: {},
//   content: 'content'
// }

// // a sample containing no content
// fixt.noContent = {
//   data: {
//     test: 'test'
//   },
//   content: ''
// }

// // a sample containing no second delim
// fixt.noSecondDelim = {
//   data: {},
//   content: '---\ncontent'
// }

// // a sample containing no first delim
// fixt.noFirstDelim = {
//   data: {},
//   content: 'content\n---\n'
// }

// describe('fm', function() {

//   describe('#test', function() {
//     it('should detect front matter in a string', function() {
//       assert.equal(true, fm.test('---\ntest: test\n---\ncontent'));
//     });
//     it('should detect front matter in a string beginning with a BOM', function() {
//       assert.equal(true, fm.test('\uFEFF---\ntest: test\n---\ncontent'));
//     });
//   });

//   describe('#parse', function() {
//     it('should parse front matter', function() {
//       assert.deepEqual(fixt.complete, fm.parse('---\ntest: test\n---\ncontent'));
//     });
//     it('should extract front matter where string contains a BOM', function() {
//       assert.deepEqual(fixt.complete, fm.parse('\uFEFF---\ntest: test\n---\ncontent'));
//     });
//     it('should parse an empty string', function() {
//       assert.deepEqual(fixt.empty, fm.parse(''));
//     });
//     it('should parse where no front matter is present', function() {
//       assert.deepEqual(fixt.noFrontMatter, fm.parse('content'));
//     });
//     it('should parse where front matter block is empty', function() {
//       assert.deepEqual(fixt.noFrontMatter, fm.parse('---\n\n---\ncontent'));
//     });
//     it('should parse where no content is present', function() {
//       assert.deepEqual(fixt.noContent, fm.parse('---\ntest: test\n---\n'))
//     });
//     it('should parse where no closing front matter delim is present', function() {
//       assert.deepEqual(fixt.noSecondDelim, fm.parse('---\ncontent'));
//     });
//     it('should parse where no opening front matter delim is present', function() {
//       assert.deepEqual(fixt.noFirstDelim, fm.parse('content\n---\n'));
//     });
//     it('should parse where dos newlines are being used', function() {
//       assert.deepEqual(fixt.complete, fm.parse('---\r\ntest: test\r\n---\r\ncontent'));
//     });
//   });
// });

// describe('fm()', function() {
//   it('should alias dm.parse()', function() {
//     assert.deepEqual(fixt.complete, fm('---\ntest: test\n---\ncontent'))
//   });
// });


