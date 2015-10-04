/* vim: set et sw=2 ts=2: */

describe('cycle', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var repeat = Nodash.repeat;

  it('cycle([1, 2, 3])', function () {
    var xs = cycle([1, 2, 3]);

    for (var i = 0; i < 4; i += 1) {
      assert.strictEqual(1, xs.head());
      assert.strictEqual(1, xs.head());
      xs = xs.tail();

      assert.strictEqual(2, xs.head());
      assert.strictEqual(2, xs.head());
      xs = xs.tail();

      assert.strictEqual(3, xs.head());
      assert.strictEqual(3, xs.head());
      xs = xs.tail();
    }

  });

  it('cycle(lazy([1, 2, 3]))', function () {
    var xs = cycle(lazy([1, 2, 3]));

    for (var i = 0; i < 4; i += 1) {
      assert.strictEqual(1, xs.head());
      assert.strictEqual(1, xs.head());
      xs = xs.tail();

      assert.strictEqual(2, xs.head());
      assert.strictEqual(2, xs.head());
      xs = xs.tail();

      assert.strictEqual(3, xs.head());
      assert.strictEqual(3, xs.head());
      xs = xs.tail();
    }

  });


  it('cycle(lazy(\'abc\'))', function () {
    var xs = cycle(lazy('abc'));

    for (var i = 0; i < 4; i += 1) {
      assert.strictEqual('a', xs.head());
      assert.strictEqual('a', xs.head());
      xs = xs.tail();

      assert.strictEqual('b', xs.head());
      assert.strictEqual('b', xs.head());
      xs = xs.tail();

      assert.strictEqual('c', xs.head());
      assert.strictEqual('c', xs.head());
      xs = xs.tail();
    }

  });


});


