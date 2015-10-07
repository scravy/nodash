/* vim: set et sw=2 ts=2: */

describe('objectToArray', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var objectToArray = Nodash.objectToArray;

  it('empty object produces empty array', function () {
    assert.deepEqual([], objectToArray({}));
  });

  it('{ a: 7 } becomes [ (\'a\', 7 ) ]', function () {
    assert(Nodash.eq([ tuple('a', 7) ], objectToArray({ a: 7 })));
  });

});

