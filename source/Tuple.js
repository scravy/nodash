/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'freeze', function (freeze) {

  var Nodash = this;
  
  function Tuple(fst, snd) {
    if (!(this instanceof Tuple)) {
      return new Tuple(fst, snd);
    }

    this.fst = Nodash.idf(fst);
    this.snd = Nodash.idf(snd);

    freeze(this);
  }
  Tuple.__type = 'tuple';

  function tuple(first, second) {
    return new Tuple(first, second);
  }

  function tuple3(first, second, third) {
    return tuple(first, tuple(second, third));
  }

  function tuple4(first, second, third, fourth) {
    return tuple3(first, second, tuple(third, fourth));
  }

  return {
    Tuple: Tuple,
    
    fst: function (t) {
      return t.fst();
    },

    snd: function (t) {
      return t.snd();
    },

    ', tuple': tuple,
    ',, tuple3': tuple3,
    ',,, tuple4': tuple4,

    tuplesToObject: function (xs) {
      var obj = {};
      Nodash.each(function (t) {
        obj[t.fst()] = t.snd();
      }, xs);
      return obj;
    },

    objectToArray: function (obj) {
      var arr = [];
      Nodash.each(function (val, key) {
        arr.push(new Tuple(key, val));
      }, obj);
      return arr;
    }

  };  
}];
