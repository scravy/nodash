/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'List', 'typeOf', 'lazy', 'arrayToString',
  function (List, typeOf, lazy, arrayToString) {

  var Nodash = this;
  
  function map(f, xs) {
    var i, ys;
    switch (typeOf(xs)) {
      case 'array':
        ys = [];
        for (i = 0; i < xs.length; i++) {
          ys.push(f(xs[i]));
        }
        return ys;
      case 'string':
        ys = [];
        for (i = 0; i < xs.length; i++) {
          ys.push(f(xs[i]));
        }
        return arrayToString(ys);
      case 'list':
        if (xs.isEmpty()) {
          return xs;
        }
      /* falls through */
      case 'stream':
        return new List(lazy(function () {
          return f(xs.head());
        }), lazy(function () {
          return map(f, xs.tail());
        }));
      case 'object':
        ys = {};
        var ks = Object.keys(xs);
        for (var j = 0; j < ks.length; j++) {
          ys[ks[j]] = f(xs[ks[j]], ks[j]);
        }
        return ys;
    }
  }

  return {
    'map fmap': map
  };

}];
