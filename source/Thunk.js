/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function () {
  
  var Nodash = this;

  function Thunk(generator) {
    var self = this;
    this.get = function () {
      var value = generator();
      self.get = function () {
        return value;
      };
      return value;
    };
  }
  Thunk.__type = 'thunk';

  return {
    
    Thunk: Thunk,

    resolveThunk: function (x) {
      if (Nodash.is(Thunk, x)) {
        return x.get();
      }
      return x;
    }

  };
};
