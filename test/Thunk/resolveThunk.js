/* vim: set et sw=2 ts=2: */

describe('resolveThunk', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var thunkLib = require('../../lib/Thunk.js').call(Nodash);
  var resolveThunk = thunkLib.resolveThunk;
  var Thunk = thunkLib.Thunk;

  it('resolveThunk should work with Thunk and retrieve its value', function () {
    var value = { pi: 3.14 };
    function generator() {
      return value;
    }
    
    var thunk = new Thunk(generator);

    assert.strictEqual(value, resolveThunk(thunk));
  });

  it('resolveThunk should work with non-Thunks too', function () {
    var value = { pi: 3.14 };

    assert.strictEqual(value, resolveThunk(value));
  });

});
