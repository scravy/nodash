/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'curried', function (curried) {

  var Nodash = this;
  var Set = require('./Set');
  
  function insertBy(f, x, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (f(x, xs[i]) <= 0) {
        return Nodash.concat([xs.slice(0,i), x, xs.slice(i)]);
      }
    }
    return Nodash.append(xs, x);
  }

  function concat(xs) {
    if (Nodash.isString(xs[0])) {
      return xs.join('');
    }
    var zs = [];
    var ks = Object.keys(xs);
    for (var i = 0; i < ks.length; i++) {
      [].push.apply(zs, xs[ks[i]]);
    }
    return zs;
  }

  function map(f, xs) {
    var i, ys;
    if (Nodash.isArray(xs)) {
      ys = [];
      for (i = 0; i < xs.length; i++) {
        ys.push(f(xs[i]));
      }
      return ys;
    }
    if (Nodash.isString(xs)) {
      ys = [];
      for (i = 0; i < xs.length; i++) {
        ys.push(f(xs[i]));
      }
      return Nodash.arrayToString(ys);
    }
    ys = {};
    var ks = Object.keys(xs);
    for (var j = 0; j < ks.length; j++) {
      ys[ks[j]] = f(xs[ks[j]], ks[j]);
    }
    return ys;
  }
  
  function zipWith(f, as, bs) {
    var length = Math.min(as.length, bs.length);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i]);
    }
    return zs;
  }

  function zipWith3(f, as, bs, cs) {
    var length = Nodash.minimum([as.length, bs.length, cs.length]);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i], cs[i]);
    }
    return zs;
  }

  function zipWith4(f, as, bs, cs, ds) {
    var length = Nodash.minimum([as.length, bs.length, cs.length, ds.length]);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i], cs[i], ds[i]);
    }
    return zs;
  }

  function groupBy(p, xs) {
    if (xs.length === 0) {
      return [];
    }
    var zs = [];
    var current = [xs[0]];
    var last = xs[0];
    for (var i = 1; i < xs.length; i++) {
      if (p(xs[i], last)) {
        current.push(xs[i]);
      } else {
        zs.push(current);
        current = [xs[i]];
      }
      last = xs[i];
    }
    zs.push(current);
    return Nodash.isString(xs) ? Nodash.map(Nodash.arrayToString, zs) : zs;
  }
  

  return {
    
    ': cons': function (x, xs) {
      if (Nodash.is(Nodash.List, xs)) {
        return new Nodash.List(x, xs);
      }
      var zs = [].slice.call(xs);
      zs.unshift(x);
      return zs;
    },

    '++ append': function (xs, ys) {
      
      if (Nodash.isString(xs)) {
        return xs + ys;
      }
      // TODO: the assumption is that it is an array now
      return [].concat.call(xs, ys);
    },

    map: map,

    filter: function (p, xs) {
      var ys;
      if (Nodash.isArray(xs) || Nodash.isString(xs)) {
        ys = [];
        for (var i = 0; i < xs.length; i++) {
          if (p(xs[i])) {
            ys.push(xs[i]);
          }
        }
        return Nodash.isString(xs) ? Nodash.arrayToString(ys) : ys;
      }
      ys = {};
      var ks = Object.keys(xs);
      for (var j = 0; j < ks.length; j++) {
        if (p(xs[ks[j]])) {
          ys[ks[j]] = xs[ks[j]];
        }
      }
      return ys;
    },

    head: function (xs) {
      if (Nodash.is(Nodash.List, xs)) {
        return xs.head();
      }
      return xs[0];
    },

    last: function (xs) {
      return xs[xs.length - 1];
    },

    tail: function (xs) {
      if (Nodash.is(Nodash.List, xs)) {
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
      if (Nodash.is(Nodash.List, xs) && xs.isEmpty()) {
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
        return new Nodash.List(xs.head(), new Nodash.Thunk(function () {
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
    },

    and: Nodash.foldl(Nodash.AND, true),

    or: Nodash.foldl(Nodash.OR, false),

    sum: Nodash.foldl(Nodash.ADD, 0),

    product: Nodash.foldl(Nodash.MUL, 1),

    maximum: Nodash.foldl(Nodash.max, -Infinity),

    minimum: Nodash.foldl(Nodash.min, +Infinity),

    any: function (p, xs) {
      for (var i = 0; i < xs.length; i++) {
        if (p(xs[i])) {
          return true;
        }
      }
      return false;
    },

    all: function (p, xs) {
      for (var i = 0; i < xs.length; i++) {
        if (!p(xs[i])) {
          return false;
        }
      }
      return true;
    },

    scanl: function (f, x, xs) {
      var zs = [x];
      for (var i = 0; i < xs.length; i++) {
        x = f(x, xs[i]);
        zs.push(x);
      }
      return zs;
    },

    scanl1: function (f, xs) {
      var x = xs[0];
      var zs = [x];
      for (var i = 1; i < xs.length; i++) {
        x = f(x, xs[i]);
        zs.push(x);
      }
      return zs;
    },

    scanr: function (f, x, xs) {
      var zs = [x];
      for (var i = xs.length - 1; i >= 0; i--) {
        x = f(xs[i], x);
        zs.unshift(x);
      }
      return zs;
    },

    scanr1: function (f, xs) {
      var x = xs[xs.length - 1];
      var zs = [x];
      for (var i = xs.length - 2; i >= 0; i--) {
        x = f(xs[i], x);
        zs.unshift(x);
      }
      return zs;
    },

    concat: concat,

    concatMap: Nodash.compose2(concat, map),

    replicate: function (n, x) {
      var xs = [];
      for (var i = 0; i < n; i++) {
        xs.push(x);
      }
      return xs;
    },

    zipWith: zipWith,

    zipWith3: zipWith3,

    zipWith4: zipWith4,

    zip: curried(zipWith)(Nodash.tuple),

    zip3: curried(zipWith3)(Nodash.tuple3),

    zip4: curried(zipWith4)(Nodash.tuple4),

    intersperse: function (x, xs) {
      if (xs.length === 0) {
        return [];
      }
      var z = [xs[0]];
      for (var i = 1; i < xs.length; i++) {
        z.push(x);
        z.push(xs[i]);
      }
      return z;
    },

    intercalate: function (x, xs) {
      return Nodash.concat(Nodash.intersperse(x, xs));
    },

    transpose: function (xss) {
      if (!Nodash.isArray(xss)) {
        var zss = {};
        var ks = Object.keys(xss);
        for (var k = 0; k < ks.length; k++) {
          zss[xss[ks[k]]] = ks[k];
        }
        return zss;
      }
      var j = 0;
      var zs = [];
      var current;
      do {
        current = [];
        for (var i = 0; i < xss.length; i++) {
          if (xss[i][j] !== undefined) {
            current.push(xss[i][j]);
          }
        }
        j += 1;
      } while (current.length > 0 && zs.push(current));
      if (Nodash.isString(xss[0])) {
        zs = Nodash.map(Nodash.arrayToString, zs);
      }
      return zs;
    },

    inits: function (xs) {
      var result, current, i, length;
      if (Nodash.isArray(xs)) {
        result = [[]];
        current = [];
        length = xs.length;
        for (i = 0; i < length; i += 1) {
          current = current.concat(xs[i]);
          result.push(current);
        }
        return result;
      }
      // TODO the assumption is it's a string now
      result = [''];
      current = '';
      length = xs.length;
      for (i = 0; i < length; i += 1) {
        current += xs[i];
        result.push(current);
      }
      return result;
    },

    tails: function (xs) {
      var result, current, i;
      if (Nodash.isArray(xs)) {
        result = [[]];
        current = [];
        for (i = xs.length - 1; i >= 0; i -= 1) {
          current = [xs[i]].concat(current);
          result.unshift(current);
        }
        return result;
      }
      // TODO the assumption is it's a string now
      result = [''];
      current = '';
      for (i = xs.length - 1; i >= 0; i -= 1) {
        current = xs[i] + current;
        result.unshift(current);
      }
      return result;
    },

    isPrefixOf: function (prefix, string) {
      for (var j = 0; j < prefix.length; j++) {
        if (string[j] !== prefix[j]) {
          return false;
        }
      }
      return true;
    },

    isSuffixOf: function (suffix, string) {
      for (var i = 0; i < suffix.length; i++) {
        if (string[string.length - suffix.length + i] !== suffix[i]) {
          return false;
        }
      }
      return true;
    },

    indexOf: require('knuth-morris-pratt'),

    isInfixOf: function (infix, string) {
      return Nodash.indexOf(infix, string) >= 0;
    },

    find: function (p, xs) {
      for (var i = 0; i < xs.length; i++) {
        if (p(xs[i])) {
          return xs[i];
        }
      }
      return null;
    },

    partition: function _partition(p, xs) {
      var as = [];
      var bs = [];
      for (var i = 0; i < xs.length; i++) {
        (p(xs[i]) ? as : bs).push(xs[i]);
      }
      if (Nodash.isString(xs)) {
        return Nodash.tuple(Nodash.arrayToString(as), Nodash.arrayToString(bs));
      }
      return Nodash.tuple(as, bs);
    },

    findIndex: function (p, xs) {
      for (var i = 0; i < xs.length; i++) {
        if (p(xs[i])) {
          return i;
        }
      }
      return null;
    },

    findIndices: function (p, xs) {
      var zs = [];
      for (var i = 0; i < xs.length; i++) {
        if (p(xs[i])) {
          zs.push(i);
        }
      }
      return zs;
    },
    
    elemIndex: function (x, xs) {
      return Nodash.findIndex(Nodash.eq(x), xs);
    },

    elemIndices: function (x, xs) {
      return Nodash.findIndices(Nodash.eq(x), xs);
    },

    nub: function (xs) {
      var set = new Set();
      var zs = [];
      for (var i = 0; i < xs.length; i++) {
        if (!set.has(xs[i])) {
          zs.push(xs[i]);
          set.add(xs[i]);
        }
      }
      return zs;
    },

    '\\\\ difference': function (xs, ys) {
      var set = new Set();
      var i;
      for (i = 0; i < ys.length; i++) {
        set.add(ys[i]);
      }
      var zs = [];
      for (i = 0; i < xs.length; i++) {
        if (!set.has(xs[i])) {
          zs.push(xs[i]);
        }
      }
      return Nodash.isString(xs) ? Nodash.arrayToString(zs) : zs;
    },

    union: function (xs, ys) {
      var set = new Set();
      var zs = [];
      var i;
      for (i = 0; i < xs.length; i++) {
        zs.push(xs[i]);
        set.add(xs[i]);
      }
      for (i = 0; i < ys.length; i++) {
        if (!set.has(ys[i])) {
          zs.push(ys[i]);
        }
      }
      return zs;
    },

    intersect: function (xs, ys) {
      var set = new Set();
      var zs = [];
      var i;
      for (i = 0; i < ys.length; i++) {
        set.add(ys[i]);
      }
      for (i = 0; i < xs.length; i++) {
        if (set.has(xs[i])) {
          zs.push(xs[i]);
        }
      }
      return zs;
    },

    sort: function (xs) {
      if (xs.length <= 1) {
        return xs;
      }
      var zs = Nodash.isString(xs) ? ''.split.call(xs, '') : [].slice.call(xs);
      if (Nodash.isNumber(zs[0])) {
        zs.sort(function (a, b) { return a - b; });
      } else if (Nodash.isString(zs[0])) {
        zs.sort(function (a, b) { return a.localeCompare(b); });
      } else {
        zs.sort(Nodash.compare);
      }
      return Nodash.isString(xs) ? zs.join('') : zs;
    },

    deleteBy: function (p, x, xs) {
      for (var i = 0; i < xs.length; i++) {
        if (p(x, xs[i])) {
          return Nodash.append(xs.slice(0,i), xs.slice(i+1));
        }
      }
      return xs;
    },

    'delete_ delete': function (x, xs) {
      var i = xs.indexOf(x);
      if (i >= 0) {
        return Nodash.append(xs.slice(0,i), xs.slice(i+1));
      }
      return xs;
    },

    insertBy: insertBy,

    insert: curried(insertBy)(Nodash.compare),

    groupBy: groupBy,

    group: curried(groupBy)(Nodash.eq),

    sortBy: function (fn, xs) {
      if (xs.length <= 1) {
        return xs;
      }
      var yesItsAString = Nodash.isString(xs);
      var zs = yesItsAString ? ''.split.call(xs, '') : [].slice.call(xs);
      zs.sort(fn);
      return yesItsAString ? zs.join('') : zs;
    },

    maximumBy: function (f, xs) {
      return Nodash.foldl1(function (a, b) {
        if (f(a, b) > 0) {
          return a;
        }
        return b;
      }, xs);
    },

    minimumBy: function (f, xs) {
      return Nodash.foldl1(function (a, b) {
        if (f(a, b) < 0) {
          return a;
        }
        return b;
      }, xs);
    }

  };
}];
