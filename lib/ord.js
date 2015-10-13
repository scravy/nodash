/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function () {

  var Nodash = this;
  
  function compare(a, b) {
    switch (typeof a) {
    case 'string':
      return a.localeCompare(b);
    case 'object':
      if (Nodash.isFunction(a.compareTo)) {
        return a.compareTo(b);
      } else if (Nodash.isArray(a)) {
        for (var i = 0; i < Math.min(a.length, b.length); i++) {
          var r = Nodash.compare(a[i], b[i]);
          if (r !== 0) {
              return r;
          }
        }
        return 0;
      }
      return a.toString().localeCompare(b.toString());
    case 'number':
      return Nodash.signum(a - b);
    }
    return undefined;
  }

  return {
    
    compare: compare,

    '< lt LT': function (a, b) {
      return compare(a, b) < 0;
    },
    
    '> gt GT': function (a, b) {
      return compare(a, b) > 0;
    },

    '<= lte LTE': function (a, b) {
      return compare(a, b) <= 0;
    },

    '>= gte GTE': function (a, b) {
      return compare(a, b) >= 0;
    },

    max: function (a, b) {
      return compare(a, b) > 0 ? a : b;
    },

    min: function (a, b) {
      return compare(a, b) < 0 ? a : b;
    },

    comparing: function (f, a, b) {
      return compare(f(a), f(b));
    }
  };
};
