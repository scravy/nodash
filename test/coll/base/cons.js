/* vim: set et sw=2 ts=2: */

describe('', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var cons = Nodash.cons;
  var take = Nodash.take;
  var typeOf = Nodash.typeOf;
  var listToArray = Nodash.listToArray;

  it('should construct strings', function () {
    assert.strictEqual('xyz', cons('x', 'yz'));
  });

  it('should construct arrays', function () {
    assert.deepEqual([ 'a', 'b', 'c' ], cons('a', [ 'b', 'c' ]));
  });

  it('should construct streams', function () {
    var result = cons(3, repeat(7));
    assert.strictEqual('stream', typeOf(result));
    assert.deepEqual([3, 7, 7], listToArray(take(3, result)));
  });

  it('should throw on invalid input', function () {
    assert.throws(function () {
      cons(7, 4);
    });
  });

});

