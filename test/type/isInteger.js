/* vim: set et sw=2 ts=2: */

describe('isInteger', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  it('should report `true` for integer number', function () {
    assert.strictEqual(true, Nodash.isInteger(4711));
    assert.strictEqual(true, Nodash.isInteger(Math.pow(2, 32) - 1));
    assert.strictEqual(true, Nodash.isInteger(-1337));
  });

  it('should report `false` for `Math.PI` and other floating point numbers', function () {
    assert.strictEqual(false, Nodash.isInteger(Math.PI));
    assert.strictEqual(false, Nodash.isInteger(0.1));
  });

  it('should report `false` for `Infinity`', function () {
    assert.strictEqual(false, Nodash.isInteger(Infinity));
  });

  [ undefined, null, true, {}, [], NaN ].forEach(function (value) {
    it('should report `false` for `' + value + '`', function () {
      assert.strictEqual(false, Nodash.isFunction(value));
    });
  });

});



