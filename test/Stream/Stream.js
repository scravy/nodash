/* vim: set et sw=2 ts=2: */

describe('Stream', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  it('should work with new', function () {
    assert.strictEqual('stream',
        Nodash.typeOf(new Nodash.Stream(function () { return Math.random(); })));
  });

  it('should work without new', function () {
    assert.strictEqual('stream',
        Nodash.typeOf(Nodash.Stream(function () { return Math.random(); })));
  });

  function gen(seed) {
    return function () {
      return Nodash.tuple(seed, gen(seed + 1));
    };
  }

  it('.head() works multiple times', function () {
    var xs = new Nodash.Stream(gen(7));
    assert.strictEqual(7, xs.head());
    assert.strictEqual(7, xs.head());
    assert.strictEqual(7, xs.head());
  });

  it('tail().head() works multiple times', function () {
    var xs = new Nodash.Stream(gen(7));
    assert.strictEqual(8, xs.tail().head());
    assert.strictEqual(8, xs.tail().head());
    assert.strictEqual(8, xs.tail().head());
  });

});
