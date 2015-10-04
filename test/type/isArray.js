/* vim: set et sw=2 ts=2: */

describe('isArray', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  it('should report `true` for `[]`', function () {
    assert.strictEqual(true, Nodash.isArray([]));
  });

  it('should report `true` for `new Array(1,2,3)`', function () {
    assert.strictEqual(true, Nodash.isArray(new Array(1,2,3)));
  });

  [ 1, undefined, null, true, false, {}, NaN ].forEach(function (value) {
    it('should report `false` for `' + value + '`', function () {
      assert.strictEqual(false, Nodash.isArray(value));
    });
  });

});
