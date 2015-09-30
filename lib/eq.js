/* vim: set et sw=2 ts=2: */

module.exports = function () {

  var Nodash = this;

  function eq(a, b) {
    if (a === b) {
      return true;
    }
    var ta = typeof a;
    var tb = typeof b;
    if (ta !== tb) {
      return false;
    }
    if (ta === 'object') {
      if (a.constructor !== b.constructor) {
        return false;
      }
      if (Nodash.is(Nodash.Tuple, a)) {
        return Nodash.eq(Nodash.fst(a), Nodash.fst(b)) &&
          Nodash.eq(Nodash.snd(a), Nodash.snd(b));
      }
      var k = Nodash.union(Object.keys(a), Object.keys(b));
      for (var i = 0; i < k.length; i++) {
        if (!eq(a[k[i]], b[k[i]])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  return {
    '== eq EQ': eq,
    '/= != <> neq NEQ': function (a, b) {
      return !eq(a, b);
    }
  };

};
