/* vim: set et sw=2 ts=2: */

describe('range', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var range = Nodash.range;

  it('.forEach() ascending', function () {
    var result = [];
    range(1, 5).forEach([].push.bind(result));
    assert.deepEqual([1,2,3,4,5], result);
  });

  it('.forEach() descending', function () {
    var result = [];
    range(5, 1).forEach([].push.bind(result));
    assert.deepEqual([5,4,3,2,1], result);
  });

});
