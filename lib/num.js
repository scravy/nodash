/* vim: set et sw=2 ts=2: */

module.exports = {

  '+ add ADD plus PLUS': function (a, b) {
    return a + b;
  },

  '- sub subtract minus MINUS': function (a, b) {
    return a - b;
  },

  '* mul MUL times TIMES': function (a, b) {
    return a * b;
  },

  abs: Math.abs,

  negate: function (x) {
    return -x;
  },

  signum: function (x) {
    if (x > 0) {
      return 1;
    } else if (x === 0) {
      return 0;
    }
    return -1;
  }
  
};
