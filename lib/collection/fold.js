/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function () {

  var Nodash = this;

  return {
    
    'foldl foldl\'': function (f, x, xs) {
      switch (Nodash.typeOf(xs)) {
        case Array:
        case String:
          for (var i = 0; i < xs.length; i += 1) {
            x = f(x, xs[i]);
          }
          return x;
      }
    },

    'foldl1 foldl1\'': function (f, xs) {
      switch (Nodash.typeOf(xs)) {
        case Array:
        case String:
          var x = xs[0];
          for (var i = 1; i < xs.length; i += 1) {
            x = f(xs[i], x);
          }
          return x;
      }
    },

    foldr: function (f, x, xs) {
      switch (Nodash.typeOf(xs)) {
        case Array:
        case String:
          for (var i = xs.length - 1; i >= 0; i -= 1) {
            x = f(xs[i], x);
          }
          return x;
      }
    },

    foldr1: function (f, xs) {
      switch (Nodash.typeOf(xs)) {
        case Array:
        case String:
          var x = xs[xs.length - 1];
          for (var i = xs.length - 2; i >= 0; i -= 1) {
            x = f(xs[i], x);
          }
          return x;
      }
    },

    concat: function (xs) {
      if (Nodash.isString(xs[0])) {
        return xs.join('');
      }
      var zs = [];
      var ks = Object.keys(xs);
      for (var i = 0; i < ks.length; i++) {
        [].push.apply(zs, xs[ks[i]]);
      }
      return zs;
    },

    map: function(f, xs) {
      var i, ys;
      if (Nodash.isArray(xs)) {
        ys = [];
        for (i = 0; i < xs.length; i++) {
          ys.push(f(xs[i]));
        }
        return ys;
      }
      if (Nodash.isString(xs)) {
        ys = [];
        for (i = 0; i < xs.length; i++) {
          ys.push(f(xs[i]));
        }
        return Nodash.arrayToString(ys);
      }
      ys = {};
      var ks = Object.keys(xs);
      for (var j = 0; j < ks.length; j++) {
        ys[ks[j]] = f(xs[ks[j]], ks[j]);
      }
      return ys;
    }
    
  };
};
