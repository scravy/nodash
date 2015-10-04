/* vim: set et sw=2 ts=2: */

describe('isBoolean', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  it('should report `true` for `true`', function () {
    assert.strictEqual(true, Nodash.isBoolean(true));
  });

  it('should report `true` for `false`', function () {
    assert.strictEqual(true, Nodash.isBoolean(false));
  });

  [ 0, 1, undefined, null, {}, NaN, '', 'string', [], [0] ].forEach(function (value) {
    it('should report `false` for `' + value + '`', function () {
      assert.strictEqual(false, Nodash.isBoolean(value));
    });
  });

});
