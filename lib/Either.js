/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'idf', 'is', 'map', 'compose', 'filter',
  function (idf, is, map, compose, filter) {

  var Nodash = this;

  var fail = function() {};

  function Either() {
    fail();
  }

  function Left(value) {
    if (!(this instanceof Left)) {
      return new Left(value);
    }
    this.value = idf(value);
  }
  Left.prototype = new Either();

  function Right(value) {
    if (!(this instanceof Right)) {
      return new Right(value);
    }
    this.value = idf(value);
  }
  Right.prototype = new Either();

  fail = function() { throw new Error(); };

  return {

    Either: Either,

    Left: Left,

    Right: Right,

    isLeft: is(Left),

    isRight: is(Right),

    either: function (afun, bfun, value) {
      if (is(Left, value)) {
        return afun(value.value());
      } else if (is(Right, value)) {
        return bfun(value.value());
      } else {
        fail();
      }
    },

    fromLeft: function (thing) {
      if (is(Left, thing)) {
        return thing.value();
      }
      fail();
    },

    fromRight: function (thing) {
      if (is(Right, thing)) {
        return thing.value();
      }
      fail();
    },

    lefts: compose(map(function (x) {
      return x.value();
    }), filter(is(Left))),

    rights: compose(map(function (x) {
      return x.value();
    }), filter(is(Right))),

    partitionEithers: function (xs) {
      return Nodash.tuple(Nodash.lefts(xs), Nodash.rights(xs));
    }
    
  };
}];
