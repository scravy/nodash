/* vim: set et sw=2 ts=2: */

describe('each', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var each = Nodash.each;
  var lazy = Nodash.lazy;

  it('should stop if the passed function returns `false`', function () {
    var xs = [];
    each(function (value) {
      xs.push(value);
      return value < 3;
    }, [ 1, 2, 3, 4, 5 ]);
    assert.deepEqual([ 1, 2, 3 ], xs);
  });

  it('should stop if the passed function returns `false`', function () {
    var xs = [];
    each(function (value) {
      xs.push(value);
      return value < 3;
    }, lazy([ 1, 2, 3, 4, 5 ]));
    assert.deepEqual([ 1, 2, 3 ], xs);
  });

  it('should stop if the passed function returns `false`', function () {
    var counter = 0;
    each(function (value) {
      counter += 1;
      return false;
    }, { a: 1, b: 2, c: 3 });
    assert.strictEqual(1, counter);
  });

});
