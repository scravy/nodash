/* vim: set et sw=2 ts=2: */

describe('maybeToList', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var maybeToList = Nodash.maybeToList;

  it('maybeToList(null)', function () {
    assert(maybeToList(null).isEmpty());
  });

  it('maybeToList(2)', function () {
    assert.strictEqual(2, maybeToList(2).head());
    assert(maybeToList(2).tail().isEmpty());
  });

});
