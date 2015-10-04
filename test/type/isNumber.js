/* vim: set et sw=2 ts=2: */

describe('isNumber', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  it('should report `true` for integer number', function () {
    assert.strictEqual(true, Nodash.isNumber(4711));
    assert.strictEqual(true, Nodash.isNumber(Math.pow(2, 32) - 1));
    assert.strictEqual(true, Nodash.isNumber(-1337));
  });

  it('should report `true` for `Math.PI` and other floating point numbers', function () {
    assert.strictEqual(true, Nodash.isNumber(Math.PI));
    assert.strictEqual(true, Nodash.isNumber(0.1));
  });

  it('should report `true` for `Infinity`', function () {
    assert.strictEqual(true, Nodash.isNumber(Infinity));
  });

  [ undefined, null, true, {}, [], NaN, '1', 'one' ].forEach(function (value) {
    it('should report `false` for `' + value + '`', function () {
      assert.strictEqual(false, Nodash.isFunction(value));
    });
  });

});


