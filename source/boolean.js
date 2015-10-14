/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = {

  '&& AND': function (a, b) {
    return a && b;
  },

  '|| OR': function (a, b) {
    return a || b;
  },

  not: function (value) {
    return !value;
  },

  bool: function (no, yes, bool) {
    return bool ? yes : no;
  }

};
