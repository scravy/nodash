/* vim: set et sw=2 ts=2: */
'use strict';

var assert = require('assert');

module.exports = function (value) {
  assert.strictEqual(value, true);
};

module.exports.strictEqual = function (expected, actual) {
  assert.strictEqual(actual, expected);
};

module.exports.deepEqual = function (expected, actual) {
  assert.deepEqual(actual, expected);
};

module.exports.throws = function (block) {
  assert.throws(block);
};
