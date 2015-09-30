/* vim: set et sw=2 ts=2: */

module.exports = function () {

  var Nodash = this;

  return {

    properFraction: function (x) {
      var num = Nodash.truncate(x);
      return [ num, -(num - x) ];
    },

    truncate: Math.trunc || function (x) {
      switch (Nodash.signum(x)) {
      case -1:
        return Math.ceil(x);
      case 1:
        return Math.floor(x);
      }
      return 0;
    },

    round: function (x) {
      var fraction = Nodash.properFraction(x);
      var n = fraction[0];
      var m = fraction[1] < 0 ? n - 1 : n + 1;
      switch (Nodash.signum(Math.abs(fraction[1]) - 0.5)) {
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
};
