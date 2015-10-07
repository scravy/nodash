/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'Thunk', 'List', 'idf', 'tuple', 'typeOf', 'freeze', 'create',
  function (Thunk, List, idf, tuple, typeOf, freeze, create) {

  var Nodash = this;

  function Stream(generator) {
    if (!(this instanceof Stream)) {
      return new Stream(generator);
    }
    var thunk = new Thunk(generator);
    var self = this;
    this.head = function () {
      var value = thunk.get().fst();
      self.head = idf(value);
      return value;
    };
    this.tail = function () {
      var value = new Stream(thunk.get().snd());
      self.tail = idf(value);
      return value;
    };
  }
  Stream.__type = 'stream';
  Stream.prototype = new List();
  Stream.prototype.constructor = Stream;
  Stream.prototype.toString = function () {
    return '[object Stream head=' + this.head() + ']';
  };

  freeze(Stream);

  return {

    'Stream stream': Stream,

    'lazy arrayToList': function (val) {
      if (Nodash.isFunction(val)) {
        return new Thunk(val);
      }
      function generator(i) {
        if (i < val.length) {
          return new List(val[i], new Thunk(function () {
            return generator(i + 1);
          }));
        }
        return Nodash.emptyList();
      }
      return generator(0);
    },

    each: function (f, xs) {
      if (Nodash.is(List, xs)) {
        while (!xs.isEmpty()) {
          f(xs.head());
          xs = xs.tail();
        }
      } else if (Nodash.isArray(xs) || Nodash.isString(xs)) {
        for (var i = 0; i < xs.length; i++) {
          f(xs[i], i);
        }
      } else if (Nodash.isObject(xs)) {
        var ks = Object.keys(xs);
        for (var j = 0; j < ks.length; j += 1) {
          f(xs[ks[j]], ks[j]);
        }
      }
    },

    repeat: function (x) {
      function generator() {
        return tuple(x, generator);
      }
      return new Stream(generator);
    },

    iterate: function (f, seed) {
      function generator(seed) {
        return function () {
          var newSeed = f(seed);
          return tuple(seed, generator(newSeed));
        };
      }
      return new Stream(generator(seed));
    },

    cycle: function (xs) {
      if (Nodash.isArray(xs)) {
        xs = Nodash.lazy(xs);
      }
      function generator(ys) {
        if (ys.isEmpty()) {
          ys = xs;
        }
        return function () {
          return tuple(ys.head(), generator(ys.tail()));
        };
      }
      return new Stream(generator(xs));
    }

  };
}];
