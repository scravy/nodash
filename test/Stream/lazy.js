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

  it('.head() of lazy([1, 2, 3]) should return `1`', function () {
    assert.strictEqual(1, lazy([1, 2, 3]).head());
  });
  
  it('.tail().head() of lazy([1, 2, 3]) should return `2`', function () {
    assert.strictEqual(2, lazy([1, 2, 3]).tail().head());
  });

  it('.tail() of lazy([1, 2, 3]) should be `[2, 3]`', function () {
    assert.deepEqual([2, 3], listToArray(lazy([1, 2, 3]).tail()));
  });

});
