/* vim: set et sw=2 ts=2: */

module.exports = function () {

  var Nodash = this;
  
  function Tuple(fst, snd) {
    this.fst = Nodash.idf(fst);
    this.snd = Nodash.idf(snd);
  }

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
    ',,, tuple4': tuple4

  };  
};