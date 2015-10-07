/* vim: set et sw=2 ts=2: */

describe('head', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var head = Nodash.head;

  it('head /w array', function () {
    assert.strictEqual(1, head([1, 2, 3]));
  });

  it('head /w list', function () {
    assert.strictEqual(1, head(Nodash.arrayToList([1, 2, 3])));
  });

  it('head /w string', function () {
    assert.strictEqual('a', head(Nodash.lazy('abc')));
  });
  
  it('throws if no collection type was passed', function () {
    assert.throws(function () {
      head();
    });
  });
  
});

