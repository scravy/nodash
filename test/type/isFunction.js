/* vim: set et sw=2 ts=2: */

describe('isFunction', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  it('should report `true` for functions', function () {
    assert.strictEqual(true, Nodash.isFunction(function () {}));
    assert.strictEqual(true, Nodash.isFunction(Array.isArray));
  });

  [ 0, undefined, null, true, {}, [], NaN ].forEach(function (value) {
    it('should report `false` for `' + value + '`', function () {
      assert.strictEqual(false, Nodash.isFunction(value));
    });
  });

});

