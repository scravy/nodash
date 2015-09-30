/* vim: set et sw=2 ts=2: */

module.exports = function () {

  var Nodash = this;

  return {
    is: function (type, thing) {
      return thing instanceof type;
    },

    isBoolean: function (thing) {
      return typeof thing === 'boolean';
    },

    isNumber: function (thing) {
      return typeof thing === 'number';
    },

    isString: function (thing) {
      return typeof thing === 'string';
    },

    isFunction: function (thing) {
      return typeof thing === 'function';
    },

    isUndefined: function (thing) {
      return typeof thing === 'undefined';
    },

    isObject: function (thing) {
      return typeof thing === 'object' &&
          thing !== null && !Array.isArray(thing);
    },

    'isNumeric isDigit': function (thing) {
      return /^[0-9]+$/.test(thing);
    },

    isInteger: function (thing) {
      return Nodash.isNumber(thing) && !isNaN(thing) &&
        thing - Math.floor(thing) === 0 &&
        thing !== Infinity && thing !== -Infinity;
    },

    isArray: Array.isArray
  };
};
