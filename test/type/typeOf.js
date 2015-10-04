/* vim: set et sw=2 ts=2: */

describe('typeOf', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var Obj = Object;
  
  var data = {
    'string': [
      '', '123', String(3)
    ],
    'array': [
      [], [ 1, 2, 3 ], new Array(17)
    ],
    'object': [
      new Date(), /[a-z]/, {}, new Obj(), Object.create({})
    ],
    'number': [
      Infinity, -Infinity, 0, 17, Math.pow(2, 32) - 1, Math.PI
    ],
    'not-a-number': [
      NaN
    ],
    'null': [
      null
    ],
    'undefined': [
      undefined
    ],
    'list': [
      Nodash.emptyList(), Nodash.singleton(4711), new List(0, Nodash.emptyList())
    ],
    'stream': [
      Nodash.stream(function () { return Math.random(); })
    ],
    'thunk': [
      Nodash.lazy(function () { return Math.random(); })
    ],
    'tuple': [
      new Tuple(1337, 4711), tuple('a', 'b')
    ]
  };

  Object.keys(data).forEach(function (type) {
    data[type].forEach(function (value) {
      it('reports `' + type + '` for `' + value + '`', function () {
        assert.strictEqual(type, Nodash.typeOf(value));
      });
    });
  });

});

