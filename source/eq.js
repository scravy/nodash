/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function () {

  var Nodash = this;

  function eq(a, b) {
    if (a === b) {
      return true;
    }
    var ta = Nodash.typeOf(a);
    var tb = Nodash.typeOf(b);
    if (ta !== tb) {
      return false;
    }
    switch (ta) {
      case 'tuple':
        return eq(a.fst(), b.fst()) && eq(a.snd(), b.snd());
      case 'list':
        return eq(a.head(), b.head()) && eq(a.tail(), b.tail());
      case 'array':
      case 'object':
        if (a.constructor !== b.constructor) {
          return false;
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
