/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'Math', function (Math) {

  return {

    exp: Math.exp,

    sqrt: Math.sqrt,

    log: Math.log,

    logBase: function (a, b) {
      return Math.log(a) / Math.log(b);
    },

    '** pow ^ ^^': Math.pow,

    sin: Math.sin,

    tan: Math.tan,

    cos: Math.cos,

    asin: Math.asin,

    atan: Math.atan,

    acos: Math.acos,

    sinh: Math.sinh || function (x) {
      return (Math.exp(x) - Math.exp(-x)) / 2;
    },

    tanh: Math.tanh || function (x) {
      if (x === Infinity) {
        return 1;
      } else if (x === -Infinity) {
        return -1;
      } else {
        return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
      }
    },

    cosh: Math.cosh || function (x) {
      return (Math.exp(x) + Math.exp(-x)) / 2;
    },

    asinh: Math.asinh || function (x) {
      if (x === -Infinity) {
        return x;
      } else {
        return Math.log(x + Math.sqrt(x * x + 1));
      }
    },

    atanh: Math.atanh || function (x) {
      return Math.log((1 + x) / (1 - x)) / 2;
    },

    acosh: Math.acosh || function (x) {
      return Math.log(x + Math.sqrt(x * x - 1));
    }

  };
}];
