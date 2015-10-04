/* vim: set et sw=2 ts=2: */

describe('Tuple', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  it('should work with new', function () {
    assert.strictEqual('tuple', Nodash.typeOf(new Nodash.Tuple(1, 2)));
  });

  it('should work without new', function () {
    assert.strictEqual('tuple', Nodash.typeOf(Nodash.Tuple(1, 2)));
  });

  it('.fst() should give first component', function () {
    assert.strictEqual(17, Nodash.tuple(17, 19).fst());
  });

  it('.snd() should give second component', function () {
    assert.strictEqual(19, Nodash.tuple(17, 19).snd());
  });

});
