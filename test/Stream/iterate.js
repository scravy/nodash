/* vim: set et sw=2 ts=2: */

describe('iterate', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var repeat = Nodash.repeat;

  it('iterate(plus(2), 2)', function () {
    var xs = iterate(Nodash.plus(2), 2);

    assert.strictEqual(2, xs.head());
    xs = xs.tail();

    assert.strictEqual(4, xs.head());
    xs = xs.tail();

    assert.strictEqual(6, xs.head());
    xs = xs.tail();

    assert.strictEqual(8, xs.head());
    xs = xs.tail();

    assert.strictEqual(10, xs.head());
  });

});

