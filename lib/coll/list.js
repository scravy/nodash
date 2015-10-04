/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'List', 'lazy', 'typeOf',
  function (List, lazy, typeOf) {

  var Nodash = this;

  function appendList(xs, ys) {
    if (xs.isEmpty()) {
      return ys;
    }
    return new List(xs.head(), lazy(function () {
      return appendList(xs.tail(), ys);
    }));
  }

  function append(xs, ys) {
    switch (typeOf(xs)) {
      case 'list':
      case 'stream':
        return appendList(xs, ys);
      case 'string':
        return xs + ys;
      case 'array':
        return [].concat.call(xs, ys);
    }
  }
  
  return {
 
    ': cons': function (x, xs) {
      if (Nodash.is(List, xs)) {
        return new List(x, xs);
      }
      var zs = [].slice.call(xs);
      zs.unshift(x);
      return zs;
    },

    '++ append': append,

    head: function (xs) {
      if (Nodash.is(List, xs)) {
        return xs.head();
      }
      return xs[0];
    },

    last: function (xs) {
      return xs[xs.length - 1];
    },

    tail: function (xs) {
      if (Nodash.is(List, xs)) {
        return xs.tail();
      }
      if (Nodash.isString(xs)) {
        return xs.slice(1);
      }
      return [].slice.call(xs, 1);
    },

    init: function (xs) {
      if (Nodash.isString(xs)) {
        return xs.slice(0, xs.length - 1);
      }
      return [].slice.call(xs, 0, xs.length - 1);
    },

    'isEmpty null_': function (xs) {
      if (Nodash.is(List, xs) && xs.isEmpty()) {
        return true;
      }
      if (Nodash.isArray(xs) || Nodash.isString(xs)) {
        return xs.length === 0;
      }
      for (var _ in xs) {
        return false;
      }
      return true;
    },

    length: function (xs) {
      if (Nodash.isObject(xs)) {
        return Object.keys(xs).length;
      }
      return xs.length;
    },

    select: function (path, object) {
      return Nodash.foldl(Nodash.at, object, path.split(/\./));
    },

    '!! at AT': function (xs, ix) {
      if (xs === undefined) {
        return xs;
      }
      return xs[ix];
    },

    reverse: function (xs) {
      var zs = Nodash.isString(xs) ? ''.split.call(xs, '') : [].slice.call(xs);
      zs.reverse();
      return Nodash.isString(xs) ? zs.join('') : zs;
    },

    take: function (n, xs) {
      if (Nodash.isArray(xs) || Nodash.isString(xs)) {
        return xs.slice(0, n);
      }
      function generator(i, xs) {
        if (i <= 0 || xs.isEmpty()) {
          return Nodash.emptyList();
        }
        return new List(xs.head(), new Nodash.Thunk(function () {
          return generator(i-1, xs.tail());
        }));
      }
      return generator(n, xs);
    },

    drop: function (n, xs) {
      return xs.slice(n);
    },

    splitAt: function (n, xs) {
      return Nodash.tuple(Nodash.take(n, xs), Nodash.drop(n, xs));
    },

    takeWhile: function (p, xs) {
      var i = 0;
      while (i < xs.length && p(xs[i])) {
        i++;
      }
      return xs.slice(0, i);
    },

    dropWhile: function (p, xs) {
      var i = 0;
      while (i < xs.length && p(xs[i])) {
        i++;
      }
      return xs.slice(i);
    },

    span: function (p, xs) {
      var i = 0;
      while (i < xs.length && p(xs[i])) {
          i++;
      }
      return Nodash.tuple(xs.slice(0, i), xs.slice(i));
    },

    'break_ break': function (p, xs) {
      var i = 0;
      while (i < xs.length && !p(xs[i])) {
        i++;
      }
      return Nodash.tuple(xs.slice(0, i), xs.slice(i));
    },

    elem: function (x, xs) {
      for (var i = 0; i < xs.length; i++) {
        if (Nodash.eq(xs[i], x)) {
          return true;
        }
      }
      return false;
    },

    notElem: function (x, xs) {
      for (var i = 0; i < xs.length; i++) {
        if (Nodash.eq(xs[i], x)) {
          return false;
        }
      }
      return true;
    },

    lookup: function (x, xs) {
      if (Nodash.isArray(xs)) {
        for (var i = 0; i < xs.length; i++) {
          if (xs[i] && Nodash.eq(xs[i][0], x)) {
            return xs[i][1];
          }
        }
      }
      return xs[x];
    }

  };
}];
