/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'List', 'Thunk', 'emptyList', 'isUndefined', 'listToArray', 'typeOf', 'error',
  function (List, Thunk, emptyList, isUndefined, listToArray, typeOf, error) {

  var Nodash = this;

  var sjt = require('steinhaus-johnson-trotter');

  function generateList(thing) {
    var generator = sjt(thing);

    function gen() {
      return new Thunk(function () {
        var next = generator();
        if (isUndefined(next)) {
          return emptyList();
        }
        return new List(next, gen());
      });
    }

    return new List(thing, gen());
  }

  return {

    permutations: function (thing) {
      switch (typeOf(thing)) {
        case 'array':
        case 'string':
          return sjt.all(thing);
        case 'list':
          return generateList(listToArray(thing));
        default:
          error(TypeError);
      }
    }

  };
  
}];
