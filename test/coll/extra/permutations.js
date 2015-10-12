/* vim: set et sw=2 ts=2: */

describe('', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var permutations = Nodash.permutations;
  var listToArray = Nodash.listToArray;

  it('should generate the permutations for \'ab\'', function () {
    assert.deepEqual([ 'ab', 'ba' ], listToArray(permutations('ab')));
  });

});
