/* vim: set et sw=2 ts=2: */

describe('', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var init = Nodash.init;
  var lazy = Nodash.lazy;
  var listToArray = Nodash.listToArray;
  var emptyList = Nodash.emptyList;

  it('should work with an array', function () {
    assert.deepEqual([1, 2], init([1, 2, 3]));
  });

  it('should work with a list', function () {
    assert.deepEqual([1, 2], listToArray(init(lazy([1, 2, 3]))));
  });

  it('should work with a string', function () {
    assert.deepEqual("ab", init("abc"));
  });
  
  it('should return `undefined` for the empty list', function () {
    assert.strictEqual(undefined, init(emptyList()));
  });

  it('throw on invalid input', function () {
    assert.throws(function () {
      init(3);
    });
  });

});

