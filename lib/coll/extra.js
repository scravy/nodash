/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'List', 'Thunk', 'emptyList', 'isUndefined',
  function (List, Thunk, emptyList, isUndefined) {

  var Nodash = this;

  var sjt = require('steinhaus-johnson-trotter');

  return {

    permutations: function (thing) {

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

  };
  
}];
