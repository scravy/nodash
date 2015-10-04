/* vim: set et sw=2 ts=2: */

describe('repeat', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var repeat = Nodash.repeat;

  it('repeat(7)', function () {
    var xs = repeat(7);
    for (var i = 0; i < 10; i += 1) {
      assert.strictEqual(7, xs.head());
      xs = xs.tail();
    }
  });

});

