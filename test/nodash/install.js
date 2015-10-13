/* vim: set et sw=2 ts=2: */

describe('nodash.install()', function () {
  'use strict';
  var assert = require('../../util/assert');
  var Nodash = require('../../nodash');

  var numberOfFunctions;

  before(function () {
    numberOfFunctions = 0;
    for (var name in Nodash) {
      if (Nodash.isFunction(Nodash[name])) {
        numberOfFunctions += 1;
      }
    }
  });

  it('install works without arguments', function (done) {
    assert.strictEqual(Nodash, Nodash.install());
    done();
  });

  it('mountpoint is returned without options', function (done) {
    var x = {};
    var xReturned = Nodash.install(x);
    assert.strictEqual(x, xReturned);
    done();
  });

  it('functions are mounted', function (done) {
      var x = Nodash.install({});
      assert.strictEqual(Nodash.map, x.map);
      done();
  });

  it('contains all Nodash functions', function (done) {
    var x = Nodash.install({});
    var count = 0;
    for (var name in x) {
      count += 1;
    }
    assert.strictEqual(numberOfFunctions, count);
    done();
  });

  it('contains only functions', function (done) {
    var obj = {};
    var x = Nodash.install(obj);
    for (var name in x) {
      assert.strictEqual(true, Nodash.isFunction(x[name]));
    }
    assert.strictEqual(obj, x);
    done();
  });

  it('works with an empty array', function (done) {
    var x = Nodash.install([]);
    var count = 0;
    for (var name in x) {
      count += 1;
    }
    assert.strictEqual(numberOfFunctions, count);
    done();
  });

  it('works with a singleton array', function (done) {
    var obj = {};
    var x = Nodash.install([ obj ]);
    var count = 0;
    for (var name in x) {
      count += 1;
    }
    assert.strictEqual(numberOfFunctions, count);
    assert.strictEqual(obj, x);
    done();
  });

  it('works with a prefix', function (done) {
    var x = Nodash.install([ '$', {} ]);
    var count = 0;
    for (var name in Nodash) {
      if (name[0] === '_') {
        continue;
      }
      assert.strictEqual(Nodash[name], x['$' + name]);
      count += 1;
    }
    assert.strictEqual(numberOfFunctions, count);
    done();
  });
  
  it('works with a postfix', function (done) {
    var x = Nodash.install([ {}, '_' ]);
    var count = 0;
    for (var name in Nodash) {
      if (name[0] === '_') continue;
      assert.strictEqual(Nodash[name], x[name + '_']);
      count += 1;
    }
    assert.strictEqual(numberOfFunctions, count);
    done();
  });

  it('works with a prefix + a postfix', function (done) {
    var x = Nodash.install([ '__', {}, '__' ]);
    var count = 0;
    for (var name in Nodash) {
      if (name[0] === '_') continue;
      assert.strictEqual(Nodash[name], x['__' + name + '__']);
      count += 1;
    }
    assert.strictEqual(numberOfFunctions, count);
    done();
  });

});
