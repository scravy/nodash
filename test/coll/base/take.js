/* vim: set et sw=2 ts=2: */

describe('take', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var take   = Nodash.take;
  var repeat = Nodash.repeat;
  var range  = Nodash.range;
  var lazy   = Nodash.lazy;
  var listToArray = Nodash.listToArray;

  it('should take 3 elements from an array', function () {
    assert.deepEqual([1, 2, 3], take(3, [1, 2, 3, 4, 5]));
  });

  it('should take 3 elements from a string', function () {
    assert.strictEqual("abc", take(3, "abcdef"));
  });

  it('should take 3 elements from a list', function () {
    assert.deepEqual([1, 2, 3], listToArray(take(3, lazy([1, 2, 3, 4, 5]))));
  });

  it('should take 3 elements from a stream', function () {
    assert.deepEqual([1, 1, 1], listToArray(take(3, repeat(1))));
  });

  it('should take 3 elements from a range', function () {
    assert.deepEqual([1, 2, 3], listToArray(take(3, range(1, 5))));
  });

  it('throws if no collection type was passed', function () {
    assert.throws(function () {
      take();
    });
  });
  
});

