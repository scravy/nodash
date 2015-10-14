/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = {

  '+ add ADD plus PLUS': function (a, b) {
    return a + b;
  },

  '- minus MINUS': function (a, b) {
    return a - b;
  },

  'sub subtract': function (a, b) {
    return b - a;
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
