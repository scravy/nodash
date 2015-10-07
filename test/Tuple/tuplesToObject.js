/* vim: set et sw=2 ts=2: */

describe('tuplesToObject', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var tuplesToObject = Nodash.tuplesToObject;
  var tuple = Nodash.tuple;

  it('should convert a list of tuples to an object', function () {
    assert.deepEqual({ a: 13, b: 17 }, tuplesToObject([tuple('a', 13), tuple('b', 17)]));
  });

});

