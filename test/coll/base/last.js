/* vim: set et sw=2 ts=2: */

describe('last', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var last = Nodash.last;
  var lazy = Nodash.lazy;
  var repeat = Nodash.repeat;

  it('should extract last element from a string', function () {
    assert.strictEqual('c', last('abc'));
  });

  it('should extract last element from an array', function () {
    assert.strictEqual(3, last([1, 2, 3]));
  });

  it('should extract last element from a list', function () {
    assert.strictEqual(3, last(lazy([1, 2, 3])));
  });

  it('should throw in case a stream is passed', function () {
    assert.throws(function () {
      last(repeat(3));
    });
  });
});

