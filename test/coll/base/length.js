/* vim: set et sw=2 ts=2: */

describe('length', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var length = Nodash.length;
  var lazy   = Nodash.lazy;
  var repeat = Nodash.repeat;

  it('length reports Infinity for streams', function () {
    assert.strictEqual(Infinity, length(repeat('x')));
  });

  it('length reports correct length for lists', function () {
    assert.strictEqual(7, length(range(1, 7)));
  });

  it('throws if neither array, string, list, stream, nor object is passed', function () {
    assert.throws(function () {
      length(17);
    });
  });
  
});

