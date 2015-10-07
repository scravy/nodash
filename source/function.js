/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'curried', 'id', function (curried, id) {

  var Nodash = this;

  return {

    id: id,

    idf: function (x) {
      return function () {
        return x;
      };
    },

    'const const_ constant': function (a, b) {
      return a;
    },

    '$ apply': function (f, x) {
      return f(x);
    },

    invoke: function (f) {
      return f();
    },

    '. compose': function (f, g, x) {
      return f(g(x));
    },

    compose2: function (f, g, x, y) {
      return f(g(x, y));
    },

    flip: function (f) {
      return curried(function (b, a) {
        return f(a, b);
      });
    },

    on: function (g, f, a, b) {
      return g(f(a), f(b));
    },

    curry: function (f) {
      return curried(function (a, b) {
        return f(Nodash.tuple(a, b));
      });
    },

    uncurry: function (f) {
      return function (t) {
        return f(Nodash.fst(t), Nodash.snd(t));
      };
    }
    
  };
}];
