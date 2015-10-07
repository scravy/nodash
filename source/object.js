/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function () {
 
  var Nodash = this;

  return {

    keys: Object.keys,

    values: function (object) {
      var values = [];
      Nodash.each(function (value) {
        values.push(value);
      }, object);
      return values;
    },

    clone: function (thing) {
      if (typeof thing === 'object') {
        if (thing === null) {
          return null;
        }
        return Nodash.map(Nodash.clone, thing);
      }
      return thing;
    }

  };
};
