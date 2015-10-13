/* vim: set et sw=2 ts=2: */

describe('', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var permutations = Nodash.permutations;
  var listToArray = Nodash.listToArray;
  var lazy = Nodash.lazy;

  it('should generate the permutations for \'ab\' lazily', function () {
    assert.deepEqual([ ['a', 'b'], ['b', 'a'] ], listToArray(permutations(lazy('ab'))));
  });

  it('should generate the permutations for \'ab\'', function () {
    assert.deepEqual([ 'ab', 'ba' ], permutations('ab'));
  });

  it('should throw if an invalid type is passed', function () {
    assert.throws(function () {
      permutations(null);
    });
  });

});
