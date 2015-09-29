/* vim: set et sw=2 ts=2: */

module.exports = function () {
  
  var Nodash = this;

  return {
    
    Thunk: function (generator) {
      var self = this;
      this.get = function () {
        var value = generator();
        this.get = function () {
          return value;
        };
        return value;
      };
    },

    resolveThunk: function (x) {
      if (Nodash.is(Nodash.Thunk, x)) {
        return x.get();
      }
      return x;
    }

  };
};
