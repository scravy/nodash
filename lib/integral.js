/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'tuple', function (tuple) {

  var Nodash = this;

  return {

    div: function (a, b) {
      return Math.floor(a / b);
    },

    quot: function (a, b) {
      var r = a / b;
      return r >= 0 ? Math.floor(r) : Math.ceil(r);
    },
    
    rem: function (a, b) {
      return a % b;
    },

    mod: function (a, b) {
      var q = Nodash.quot(a, b);
      var r = Nodash.rem(a, b);
      return Nodash.signum(r) === -Nodash.signum(b) ? r + b : r;
    },
    
    divMod: function (a, b)  {
      return tuple(Nodash.div(a, b), Nodash.mod(a, b));
    },

    quotRem: function (a, b) {
      return tuple(Nodash.quot(a, b), Nodash.rem(a, b));
    }

  };
}];
