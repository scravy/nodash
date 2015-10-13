/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = {
  
  isAsciiLetter: function (x) {
    return /^[a-zA-Z]+$/.test(x);
  },

  isLetter: function (x) {
    var xUpper = x.toUpperCase();
    var xLower = x.toLowerCase();
    for (var i = 0; i < x.length; i += 1) {
      if (xUpper[i] === xLower[i]) {
        return false;
      }
    }
    return true;
  },

  isUpper: function (x) {
    var xUpper = x.toUpperCase();
    var xLower = x.toLowerCase();
    for (var i = 0; i < x.length; i += 1) {
      if (xUpper[i] === xLower[i] || x[i] !== xUpper[i]) {
        return false;
      }
    }
    return true;
  },

  isLower: function (x) {
    var xUpper = x.toUpperCase();
    var xLower = x.toLowerCase();
    for (var i = 0; i < x.length; i += 1) {
      if (xUpper[i] === xLower[i] || x[i] !== xLower[i]) {
        return false;
      }
    }
    return true;
  },

  ord: function (x) {
    return x.charCodeAt(0);
  },

  chr: function (x) {
    return String.fromCharCode(x);
  }

};
