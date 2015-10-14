/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'Math', 'signum', 'tuple',
  function (Math, signum, tuple) {

  var truncate = Math.trunc || function (x) {
    switch (signum(x)) {
    case -1:
      return Math.ceil(x);
    case 1:
      return Math.floor(x);
    }
    return 0;
  };

  function properFraction(x) {
    var num = truncate(x);
    return [ num, -(num - x) ];
  }

  return {

    properFraction: function (x) {
      var num = truncate(x);
      return tuple(num, -(num - x));
    },

    truncate: truncate,

    round: function (x) {
      var fraction = properFraction(x);
      var n = fraction[0];
      var m = fraction[1] < 0 ? n - 1 : n + 1;
      switch (signum(Math.abs(fraction[1]) - 0.5)) {
        case -1:
          return n;
        case 0:
          return n % 2 === 0 ? n : m;
        case 1:
          return m;
      }
    },

    ceiling: Math.ceil,

    floor: Math.floor

  };
}];
