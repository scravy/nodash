/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'List', 'lazy', 'typeOf', 'error', 'Thunk',
  function (List, lazy, typeOf, error, Thunk) {

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
      default:
        error(TypeError);
    }
  }
  
  function takeGenerator(n, xs) {
    if (n <= 0 || xs.isEmpty()) {
      return Nodash.emptyList();
    }
    return new List(xs.head(), new Thunk(function () {
      return takeGenerator(n - 1, xs.tail());
    }));
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
      switch (typeOf(xs)) {
        case 'array':
        case 'string':
          return xs[0];
        case 'list':
        case 'stream':
          return xs.head();
        default:
          error(TypeError);
      }
    },

    last: function (xs) {
      switch (typeOf(xs)) {
        case 'array':
        case 'string':
          return xs[xs.length - 1];
        case 'list':
          if (xs.isEmpty()) {
            return undefined;
          }
          for (var ts = xs.tail(); !ts.isEmpty();) {
              xs = xs.tail();
              ts = xs.tail();
          }
          return xs.head();
        default:
          error(TypeError);
      }
    },

    tail: function (xs) {
      switch (typeOf(xs)) {
        case 'array':
          return [].slice.call(xs, 1);
        case 'string':
          return "".slice.call(xs, 1);
        case 'list':
        case 'stream':
          return xs.tail();
        default:
          error(TypeError);
      }
    },

    init: function (xs) {
      if (Nodash.isString(xs)) {
        return xs.slice(0, xs.length - 1);
      }
      return [].slice.call(xs, 0, xs.length - 1);
    },

    'isEmpty null_': function (xs) {
      switch (typeOf(xs)) {
        case 'array':
        case 'string':
          return xs.length === 0;
        case 'list':
        case 'stream':
          return xs.isEmpty();
        default:
          for (var _ in xs) {
            return false;
          }
          return true;
      }
    },

    length: function (xs) {
      switch (typeOf(xs)) {
        case 'array':
        case 'string':
          return xs.length;
        case 'list':
          var count = 0;
          while (!xs.isEmpty()) {
            count += 1;
            xs = xs.tail();
          }
          return count;
        case 'stream':
          return Infinity;
        case 'object':
          return Object.keys(xs).length;
        default:
          error(TypeError);
      }
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
      switch (typeOf(xs)) {
        case 'string':
          return "".slice.call(xs, 0, n);
        case 'array':
          return [].slice.call(xs, 0, n);
        case 'list':
        case 'stream':
          return takeGenerator(n, xs);
        default:
          error(TypeError);
      }
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
