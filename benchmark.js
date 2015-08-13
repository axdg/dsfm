var Benchmark = require('benchmark'),
    glob = require('glob'),
    fs = require('fs');

var fm = require('front-matter');
var gm = require('gray-matter');
var dm = require('./');

var suite = new Benchmark.Suite;

// dark-matter
suite.add('dark-matter', function() {
  dm('---\ntest: test\n---\r\ncontent');
});

// front-matter
suite.add('front-matter', function() {
  fm('---\ntest: test\n---\r\ncontent');
});

// gray-matter
suite.add('grey-matter', function() {
  gm('---\ntest: test\n---\r\ncontent');
});

suite.on('cycle', function(e) {
  console.log(String(e.target));
});

suite.run();


