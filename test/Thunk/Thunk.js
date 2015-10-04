/* vim: set et sw=2 ts=2: */

describe('Thunk', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var Thunk = require('../../lib/Thunk.js').call(Nodash).Thunk;

  it('.get() should retrieve the value from the generator', function () {
    var value = { pi: 3.14 };
    function generator() {
      return value;
    }
    
    var thunk = new Thunk(generator);

    assert.strictEqual(value, thunk.get());
  });

  it('.get() should retrieve the value repeatedly', function () {
    var value = { pi: 3.14 };
    function generator() {
      return value;
    }
    
    var thunk = new Thunk(generator);

    for (var i = 0; i < 10; i += 1) {
      assert.strictEqual(value, thunk.get());
    }
  });

  it('.get() should invoke the generator once', function () {
    var value = { pi: 3.14 };
    var invoked = 0;
    function generator() {
      invoked += 1;
      return value;
    }
    
    var thunk = new Thunk(generator);

    assert.strictEqual(value, thunk.get());
    assert.strictEqual(value, thunk.get());
    assert.strictEqual(1, invoked);
  });

});
