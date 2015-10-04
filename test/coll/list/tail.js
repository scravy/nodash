/* vim: set et sw=2 ts=2: */

describe('tail', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var head = Nodash.head;

  it('tail /w array', function () {
    assert.deepEqual([2, 3], tail([1, 2, 3]));
  });

  it('tail /w list', function () {
    assert.deepEqual([2, 3], listToArray(tail(Nodash.arrayToList([1, 2, 3]))));
  });

  it('tail /w string', function () {
    assert.strictEqual('bc', listToString(tail(Nodash.lazy('abc'))));
  });
});

