/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function () {

  var Nodash = this;

  var toString = Object.prototype.toString;

  return {

    typeOf: function (thing) {
      var type = typeof thing;
      switch (type) {
        case 'number':
          return isNaN(thing) ? 'not-a-number' : 'number';
        case 'object':
          var exactType = toString.call(thing);
          exactType = exactType.slice(8, exactType.length - 1).toLowerCase();
          if (exactType === 'object' && thing.constructor && thing.constructor.__type) {
            return thing.constructor.__type;
          }
          return exactType;
        default:
          return type;
      }
    },

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
      return typeof thing === 'string' || toString.call(thing) === '[object String]';
    },

    isFunction: function (thing) {
      return typeof thing === 'function';
    },

    isUndefined: function (thing) {
      return typeof thing === 'undefined';
    },

    isRegExp: function (thing) {
      return toString.call(thing) === '[object RegExp]';
    },

    isDate: function (thing) {
      return toString.call(thing) === '[object Date]';
    },

    isNull: function (thing) {
      return toString.call(thing) === '[object Null]';
    },

    isArguments: function (thing) {
      return toString.call(thing) === '[object Arguments]';
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
