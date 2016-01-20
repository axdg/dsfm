var Benchmark = require('benchmark'),
    fs = require('fs');

var fm = require('front-matter'),
    gm = require('gray-matter'),
    dm = require('./');

/*
 * low complexity post
 *
**/
var suite = new Benchmark.Suite;

// small sample
suite.on('start', function() {
  console.log('small sample')
});

// front-matter
suite.add('front-matter', function() {
  fm('---\ntest: test\n---\r\ncontent');
});

// gray-matter
suite.add('grey-matter', function() {
  gm('---\ntest: test\n---\r\ncontent');
});

// dark-matter
suite.add('dark-matter', function() {
  dm('---\ntest: test\n---\r\ncontent');
});

suite.on('cycle', function(e) {
  console.log(String(e.target));
});

suite.on('complete', function() {
  console.log('\r\n')
});

suite.run();

/*
 * medium complexity post
 *
**/
var suite = new Benchmark.Suite;

suite.on('start', function() {
  console.log('// medium sample')
});

suite.add('fn', function() {
  // testing against a medium sized sample
});

suite.on('cycle', function(e) {
  console.log(String(e.target))
});

suite.on('complete', function() {
  console.log('\r\n')
});

suite.run();

/*
 * high complexity post
 *
**/
var suite = new Benchmark.Suite;

suite.on('start', function() {
  console.log('// large sample')
});

suite.add('fn', function() {
  // testing against a
});

suite.on('cycle', function(e) {
  console.log(String(e.target))
});

suite.on('complete', function() {
  console.log('\r\n')
});

suite.run();
