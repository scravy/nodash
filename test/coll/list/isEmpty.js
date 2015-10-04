/* vim: set et sw=2 ts=2: */

describe('isEmpty / null_', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var isEmpty = Nodash.isEmpty;

  it('isEmpty /w array', function () {
    assert(!isEmpty([1, 2, 3]));
    assert(isEmpty([]));
  });

  it('isEmpty /w list', function () {
    assert(!isEmpty(Nodash.arrayToList([1, 2, 3])));
    assert(isEmpty(Nodash.arrayToList([])));
    assert(isEmpty(Nodash.emptyList()));
  });

  it('isEmpty /w string', function () {
    assert(!isEmpty(Nodash.lazy('abc')));
    assert(isEmpty(Nodash.lazy('')));
  });
});

