/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'List', 'Stream', 'typeOf', 'lazy', 'emptyList',
  function (List, Stream, typeOf, lazy, emptyList) {

  var Nodash = this;

  return {
    
    'foldl foldl\'': function (f, x, xs) {
      switch (typeOf(xs)) {
        case Array:
        case String:
          for (var i = 0; i < xs.length; i += 1) {
            x = f(x, xs[i]);
          }
          return x;
        case List:
          while (!xs.isEmpty()) {
            x = f(xs.head(), x);
            xs = xs.tail();
          }
          return x;
      }
    },

    'foldl1 foldl1\'': function (f, xs) {
      switch (typeOf(xs)) {
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
      switch (typeOf(xs)) {
        case Array:
        case String:
          for (var i = xs.length - 1; i >= 0; i -= 1) {
            x = f(xs[i], x);
          }
          return x;
        case List:
          if (xs.isEmpty()) {
            return x;
          }
          return f(Nodash.foldr(f, x, xs.tail()), xs.head());
      }
    },

    foldr1: function (f, xs) {
      switch (typeOf(xs)) {
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
      switch (typeOf(xs)) {
        case Array:
          ys = [];
          for (i = 0; i < xs.length; i++) {
            ys.push(f(xs[i]));
          }
          return ys;
        case String:
          ys = [];
          for (i = 0; i < xs.length; i++) {
            ys.push(f(xs[i]));
          }
          return Nodash.arrayToString(ys);
        case List:
          if (xs.isEmpty()) {
            return emptyList();
          }
        /* falls through */
        case Stream:
          return new List(lazy(function () {
            return f(xs.head());
          }), lazy(function () {
            return Nodash.map(f, xs.tail());
          }));
        default:
          ys = {};
          var ks = Object.keys(xs);
          for (var j = 0; j < ks.length; j++) {
            ys[ks[j]] = f(xs[ks[j]], ks[j]);
          }
          return ys;
      }
    },

    filter: function (p, xs) {
      var ys;
      switch (Nodash.typeOf(xs)) {
        case Array:
        case String:
          ys = [];
          for (var i = 0; i < xs.length; i++) {
            if (p(xs[i])) {
              ys.push(xs[i]);
            }
          }
          return Nodash.isString(xs) ? Nodash.arrayToString(ys) : ys;
        default:
          ys = {};
          var ks = Object.keys(xs);
          for (var j = 0; j < ks.length; j++) {
            if (p(xs[ks[j]])) {
              ys[ks[j]] = xs[ks[j]];
            }
          }
          return ys;
      }
    }

  };
}];
