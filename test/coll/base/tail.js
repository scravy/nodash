/* vim: set et sw=2 ts=2: */

describe('tail', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var tail = Nodash.tail;

  it('tail /w array', function () {
    assert.deepEqual([2, 3], tail([1, 2, 3]));
  });

  it('tail /w list', function () {
    assert.deepEqual([2, 3], Nodash.listToArray(tail(Nodash.arrayToList([1, 2, 3]))));
  });

  it('tail /w string', function () {
    assert.strictEqual('bc', tail('abc'));
  });

  it('throws if no collection type was passed', function () {
    assert.throws(function () {
      tail();
    });
  });
  
});

