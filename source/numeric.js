/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function () {

  var Nodash = this;

  return {
    
    gcd: function (a, b) {
      var c;
      while (b !== 0) {
        c = Nodash.rem(a, b);
        a = b;
        b = c;
      }
      return a;
    },

    lcm: function (a, b) {
      if (a === 0 || b === 0) {
        return 0;
      }
      return Math.abs(Nodash.quot(a, Nodash.gcd(a, b)) * b);
    },

    even: function (x) {
      return (x % 2) === 0;
    },

    odd: function (x) {
      return (x % 2) !== 0;
    }

  };
};
