/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'List', 'Stream', 'typeOf', 'lazy', 'emptyList',
  function (List, Stream, typeOf, lazy, emptyList) {

  var Nodash = this;

  return {
    
    'foldl foldl\' reduceLeft': function (f, x, xs) {
      switch (typeOf(xs)) {
        case 'array':
        case 'string':
          for (var i = 0; i < xs.length; i += 1) {
            x = f(x, xs[i]);
          }
          return x;
        case 'list':
          while (!xs.isEmpty()) {
            x = f(xs.head(), x);
            xs = xs.tail();
          }
          return x;
      }
    },

    'foldl1 foldl1\'': function (f, xs) {
      switch (typeOf(xs)) {
        case 'array':
        case 'string':
          var x = xs[0];
          for (var i = 1; i < xs.length; i += 1) {
            x = f(xs[i], x);
          }
          return x;
      }
    },

    'foldr reduceRight': function (f, x, xs) {
      switch (typeOf(xs)) {
        case 'array':
        case 'string':
          for (var i = xs.length - 1; i >= 0; i -= 1) {
            x = f(xs[i], x);
          }
          return x;
        case 'list':
          if (xs.isEmpty()) {
            return x;
          }
          return f(Nodash.foldr(f, x, xs.tail()), xs.head());
      }
    },

    foldr1: function (f, xs) {
      switch (typeOf(xs)) {
        case 'array':
        case 'string':
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

    filter: function (p, xs) {
      var ys;
      switch (typeOf(xs)) {
        case 'array':
        case 'string':
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
