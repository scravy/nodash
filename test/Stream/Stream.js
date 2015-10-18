/* vim: set et sw=2 ts=2: */

describe('Stream', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var Stream = Nodash.Stream;
  var tuple = Nodash.tuple;
  var typeOf = Nodash.typeOf;
  var emptyList = Nodash.emptyList;

  it('should work with new', function () {
    assert.strictEqual('stream',
        typeOf(new Stream(function () { return Math.random(); })));
  });

  it('should work without new', function () {
    assert.strictEqual('stream',
        typeOf(new Stream(function () { return Math.random(); })));
  });

  function gen(seed) {
    return function () {
      return tuple(seed, gen(seed + 1));
    };
  }

  it('.head() works multiple times', function () {
    var xs = new Stream(gen(7));
    assert.strictEqual(7, xs.head());
    assert.strictEqual(7, xs.head());
    assert.strictEqual(7, xs.head());
  });

  it('tail().head() works multiple times', function () {
    var xs = new Stream(gen(7));
    assert.strictEqual(8, xs.tail().head());
    assert.strictEqual(8, xs.tail().head());
    assert.strictEqual(8, xs.tail().head());
  });

  it('should throw on invalid types in generator', function () {
    assert.throws(function () {
      var s = new Stream(function () {
        return tuple(3, 4);
      });
      s.tail();
    });
  });

  it('should work with generators returning lists as tail', function () {
    var s = new Stream(function () {
      return tuple(3, emptyList());
    });
    assert.strictEqual('list', typeOf(s.tail()));
  });

});
