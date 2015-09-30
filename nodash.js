/* vim: set et sw=2 ts=2: */

function makeNodash(options) {
  'use strict';

  options = options || {};

  // Basic ECMA Script 5 checks (if these fail pull in `es5-shim`).

  if (typeof Object.keys !== 'function' || Object.keys({ x: 7 })[0] !== 'x') {
    throw new Error('ES5 `Object.keys` required (es5-shim will do).');
  }
  if (typeof Array.isArray !== 'function' || !Array.isArray([])) {
    throw new Error('ES5 `Array.isArray` required (es5-shim will do).');
  }

  // This is the object the nodash functions will be attached to.
  var Nodash = {};
  
  var register = require('./lib/register')(Nodash, options);

  register('curried', require('./lib/curried.js'));

  register(require('./lib/type'));
  register(require('./lib/function'));
  
  register(require('./lib/Thunk'));
  register(require('./lib/Tuple'));
  register(require('./lib/List'));

  register(require('./lib/boolean'));
  
  register(require('./lib/eq'));
  register(require('./lib/ord'));
  register(require('./lib/char'));
  register(require('./lib/num'));
  register(require('./lib/integral'));
  register(require('./lib/fractional'));
  register(require('./lib/floating'));
  register(require('./lib/realfrac'));
  register(require('./lib/numeric'));

  var Set = require('./lib/Set');

  // RealFloat

  /* ... */


  // group('Streams');

  function Stream(generator) {
    var thunk = new Nodash.Thunk(generator);
    var self = this;
    this.head = function () {
      var value = thunk.get().fst();
      self.head = Nodash.idf(value);
      return value;
    };
    this.tail = function () {
      var value = new Stream(thunk.get().snd());
      self.tail = Nodash.idf(value);
      return value;
    };
  }
  Stream.prototype = new Nodash.List();
  Stream.prototype.isEmpty = Nodash.idf(false);
  register('Stream', Stream);

  function stream(generator) {
    return new Stream(generator);
  }
  register('stream', stream);

  function lazy(val) {
    if (Nodash.isFunction(val)) {
      return new Nodash.Thunk(val);
    }
    if (!Nodash.isArray(val) && !Nodash.isString(val)) {
      return;
    }
    function generator(i) {
      if (i < val.length) {
        return new Nodash.List(val[i], new Nodash.Thunk(function () {
          return generator(i + 1);
        }));
      }
      return Nodash.emptyList();
    }
    return generator(0);
  }
  register('lazy', lazy);

  function each(f, xs) {
    if (Nodash.is(Nodash.Thunk, f)) {
      f = f.get();
    }
    if (Nodash.is(Nodash.Thunk, xs)) {
      xs = xs.get();
    }
    if (Nodash.is(Nodash.List, xs)) {
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
  }
  register('each', each);

  register('repeat', function (x) {
    function generator() {
      return Nodash.tuple(x, generator);
    }
    return stream(generator);
  });

  register('iterate', function (f, seed) {
    function generator(seed) {
      return function () {
        var newSeed = f(seed);
        return Nodash.tuple(seed, generator(newSeed));
      };
    }
    return stream(generator(seed));
  });

  register('cycle', function (xs) {
    if (Nodash.isArray(xs)) {
      xs = lazy(xs);
    }
    function generator(ys) {
      if (ys.isEmpty()) {
        ys = xs;
      }
      return function () {
        return Nodash.tuple(ys.head(), generator(ys.tail()));
      };
    }
    return stream(generator(xs));
  });

  
  // group('Strings');

  register('lines', function _lines(string) {
    var result = string.split(/\n/);
    if (result[result.length - 1].length === 0) {
      delete result[result.length - 1];
    }
    return result;
  });

  register('unlines', function _unlines(lines) {
    return lines.join('\n');
  });

  register('words', function _words(string) {
    return string.split(/[\n\r\v\t ]/);
  });

  register('unwords', function _unwords(words) {
    return words.join(' ');
  });


  // group('Collections');

  register(':', 'cons', function _cons(x, xs) {
    if (Nodash.is(Nodash.List, xs)) {
      return new Nodash.List(x, xs);
    }
    var zs = [x];
    [].push.apply(zs, xs);
    return zs;
  });

  register('++', 'append', function _append(xs, ys) {
    
    if (Nodash.isString(xs)) {
      return xs + ys;
    }
    // TODO: the assumption is that it is an array now
    return [].concat.call(xs, ys);
  });

  register('map', function _map(f, xs) {
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
  });

  register('filter', function _filter(p, xs) {
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
  });

  register('head', function _head(xs) {
    if (Nodash.is(Nodash.List, xs)) {
      return xs.head();
    }
    return xs[0];
  });

  register('last', function _last(xs) {
    return xs[xs.length - 1];
  });

  register('tail', function _tail(xs) {
    if (Nodash.is(Nodash.List, xs)) {
      return xs.tail();
    }
    if (Nodash.isString(xs)) {
      return xs.slice(1);
    }
    return [].slice.call(xs, 1);
  });

  register('init', function _init(xs) {
    if (Nodash.isString(xs)) {
      return xs.slice(0, xs.length - 1);
    }
    return [].slice.call(xs, 0, xs.length - 1);
  });

  function isEmpty(xs) {
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
  }
  register('isEmpty', 'null_', isEmpty);

  register('length', function _length(xs) {
    if (Nodash.isObject(xs)) {
      return Object.keys(xs).length;
    }
    return xs.length;
  });

  register('select', function _select(path, object) {
    return Nodash.foldl(Nodash.at, object, path.split(/\./));
  });

  register('!!', 'at', 'AT', function _at(xs, ix) {
    if (xs === undefined) {
      return xs;
    }
    return xs[ix];
  });

  register('reverse', function _reverse(xs) {
    var zs = Nodash.isString(xs) ? ''.split.call(xs, '') : [].slice.call(xs);
    zs.reverse();
    return Nodash.isString(xs) ? zs.join('') : zs;
  });

  function take(n, xs) {
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
  }
  register('take', take);

  function drop(n, xs) {
    return xs.slice(n);
  }
  register('drop', drop);

  register('splitAt', function _splitAt(n, xs) {
    return Nodash.tuple(take(n, xs), drop(n, xs));
  });

  register('takeWhile', function _takeWhile(p, xs) {
    var i = 0;
    while (i < xs.length && p(xs[i])) {
      i++;
    }
    return xs.slice(0, i);
  });

  register('dropWhile', function _dropWhile(p, xs) {
    var i = 0;
    while (i < xs.length && p(xs[i])) {
      i++;
    }
    return xs.slice(i);
  });

  register('span', function _span(p, xs) {
    var i = 0;
    while (i < xs.length && p(xs[i])) {
        i++;
    }
    return Nodash.tuple(xs.slice(0, i), xs.slice(i));
  });

  register('break_', 'break', function _break(p, xs) {
    var i = 0;
    while (i < xs.length && !p(xs[i])) {
      i++;
    }
    return Nodash.tuple(xs.slice(0, i), xs.slice(i));
  });

  register('elem', function _elem(x, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (Nodash.eq(xs[i], x)) {
        return true;
      }
    }
    return false;
  });

  register('notElem', function _notElem(x, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (Nodash.eq(xs[i], x)) {
        return false;
      }
    }
    return true;
  });

  register('lookup', function _lookup(x, xs) {
    if (Nodash.isArray(xs)) {
      for (var i = 0; i < xs.length; i++) {
        if (xs[i] && Nodash.eq(xs[i][0], x)) {
          return xs[i][1];
        }
      }
    }
    return xs[x];
  });

  register('foldl', 'foldl\'', function _foldl(f, x, xs) {
    for (var i = 0; i < xs.length; i++) {
      x = f(x, xs[i]);
    }
    return x;
  });

  register('foldl1', 'foldl1\'', function _foldl1(f, xs) {
    var x = xs[0];
    for (var i = 1; i < xs.length; i++) {
      x = f(x, xs[i]);
    }
    return x;
  });

  register('foldr', function _foldr(f, x, xs) {
    for (var i = xs.length - 1; i >= 0; i--) {
      x = f(xs[i], x);
    }
    return x;
  });

  register('foldr1', function _foldr1(f, xs) {
    var x = xs[xs.length - 1];
    for (var i = xs.length - 2; i >= 0; i--) {
      x = f(xs[i], x);
    }
    return x;
  });

  register('and', Nodash.foldl(Nodash.AND, true));

  register('or', Nodash.foldl(Nodash.OR, false));

  register('sum', Nodash.foldl(Nodash.ADD, 0));

  register('product', Nodash.foldl(Nodash.MUL, 1));

  register('maximum', Nodash.foldl(Nodash.max, -Infinity));

  register('minimum', Nodash.foldl(Nodash.min, +Infinity));

  register('any', function _any(p, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (p(xs[i])) {
        return true;
      }
    }
    return false;
  });

  register('all', function _all(p, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (!p(xs[i])) {
        return false;
      }
    }
    return true;
  });

  register('scanl', function _scanl(f, x, xs) {
    var zs = [x];
    for (var i = 0; i < xs.length; i++) {
      x = f(x, xs[i]);
      zs.push(x);
    }
    return zs;
  });

  register('scanl1', function _scanl1(f, xs) {
    var x = xs[0];
    var zs = [x];
    for (var i = 1; i < xs.length; i++) {
      x = f(x, xs[i]);
      zs.push(x);
    }
    return zs;
  });

  register('scanr', function _scanr(f, x, xs) {
    var zs = [x];
    for (var i = xs.length - 1; i >= 0; i--) {
      x = f(xs[i], x);
      zs.unshift(x);
    }
    return zs;
  });

  register('scanr1', function _scanr1(f, xs) {
    var x = xs[xs.length - 1];
    var zs = [x];
    for (var i = xs.length - 2; i >= 0; i--) {
      x = f(xs[i], x);
      zs.unshift(x);
    }
    return zs;
  });

  register('concat', function _concat(xs) {
    if (Nodash.isString(xs[0])) {
      return xs.join('');
    }
    var zs = [];
    var ks = Object.keys(xs);
    for (var i = 0; i < ks.length; i++) {
      [].push.apply(zs, xs[ks[i]]);
    }
    return zs;
  });

  register('concatMap', Nodash.compose2(Nodash.concat, Nodash.map));

  register('replicate', function _replicate(n, x) {
    var xs = [];
    for (var i = 0; i < n; i++) {
      xs.push(x);
    }
    return xs;
  });

  register('zipWith', function _zipWith(f, as, bs) {
    var length = Math.min(as.length, bs.length);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i]);
    }
    return zs;
  });

  register('zipWith3', function _zipWith3(f, as, bs, cs) {
    var length = Nodash.minimum([as.length, bs.length, cs.length]);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i], cs[i]);
    }
    return zs;
  });

  register('zipWith4', function _zipWith4(f, as, bs, cs, ds) {
    var length = Nodash.minimum([as.length, bs.length, cs.length, ds.length]);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i], cs[i], ds[i]);
    }
    return zs;
  });

  register('zip', Nodash.zipWith(Nodash.tuple));

  register('zip3', Nodash.zipWith3(Nodash.tuple3));

  register('zip4', Nodash.zipWith4(Nodash.tuple4));

  register('intersperse', function _intersperse(x, xs) {
    if (xs.length === 0) {
      return [];
    }
    var z = [xs[0]];
    for (var i = 1; i < xs.length; i++) {
      z.push(x);
      z.push(xs[i]);
    }
    return z;
  });

  register('intercalate', function _intercalate(x, xs) {
    return Nodash.concat(Nodash.intersperse(x, xs));
  });

  register('transpose', function _transpose(xss) {
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
  });

  register('inits', function _inits(xs) {
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
  });

  register('tails', function _tails(xs) {
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
  });

  register('isPrefixOf', function _isPrefixOf(prefix, string) {
    for (var j = 0; j < prefix.length; j++) {
      if (string[j] !== prefix[j]) {
        return false;
      }
    }
    return true;
  });

  register('isSuffixOf', function _isSuffixOf(suffix, string) {
    for (var i = 0; i < suffix.length; i++) {
      if (string[string.length - suffix.length + i] !== suffix[i]) {
        return false;
      }
    }
    return true;
  });

  var indexOf = require('knuth-morris-pratt');

  register('isInfixOf', function _isInfixOf(infix, string) {
    return indexOf(infix, string) >= 0;
  });

  register('indexOf', indexOf);

  register('find', function _find(p, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (p(xs[i])) {
        return xs[i];
      }
    }
    return null;
  });

  register('partition', function _partition(p, xs) {
    var as = [];
    var bs = [];
    for (var i = 0; i < xs.length; i++) {
      (p(xs[i]) ? as : bs).push(xs[i]);
    }
    if (Nodash.isString(xs)) {
      return Nodash.tuple(Nodash.arrayToString(as), Nodash.arrayToString(bs));
    }
    return Nodash.tuple(as, bs);
  });

  register('findIndex', function _elemIndex(p, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (p(xs[i])) {
        return i;
      }
    }
    return null;
  });

  register('findIndices', function _elemIndex(p, xs) {
    var zs = [];
    for (var i = 0; i < xs.length; i++) {
      if (p(xs[i])) {
        zs.push(i);
      }
    }
    return zs;
  });
  
  register('elemIndex', function _elemIndex(x, xs) {
    return Nodash.findIndex(Nodash.eq(x), xs);
  });

  register('elemIndices', function _elemIndex(x, xs) {
    return Nodash.findIndices(Nodash.eq(x), xs);
  });

  register('nub', function _nub(xs) {
    var set = new Set();
    var zs = [];
    for (var i = 0; i < xs.length; i++) {
      if (!set.has(xs[i])) {
        zs.push(xs[i]);
        set.add(xs[i]);
      }
    }
    return zs;
  });

  register('\\\\', 'difference', function _difference(xs, ys) {
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
  });

  register('union', function _union(xs, ys) {
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
  });

  register('intersect', function _intersect(xs, ys) {
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
  });

  register('sort', function _sort(xs) {
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
  });

  register('deleteBy', function _deleteBy(p, x, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (p(x, xs[i])) {
        return Nodash.append(xs.slice(0,i), xs.slice(i+1));
      }
    }
    return xs;
  });

  register('delete_', 'delete', function _delete(x, xs) {
    var i = xs.indexOf(x);
    if (i >= 0) {
      return Nodash.append(xs.slice(0,i), xs.slice(i+1));
    }
    return xs;
  });

  register('insertBy', function _insertBy(f, x, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (f(x, xs[i]) <= 0) {
        return Nodash.concat([xs.slice(0,i), x, xs.slice(i)]);
      }
    }
    return Nodash.append(xs, x);
  });

  register('insert', Nodash.insertBy(Nodash.compare));

  register('groupBy', function _groupBy(p, xs) {
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
  });

  register('group', Nodash.groupBy(Nodash.eq));

  register('sortBy', function _sortBy(fn, xs) {
    if (xs.length <= 1) {
      return xs;
    }
    var yesItsAString = Nodash.isString(xs);
    var zs = yesItsAString ? ''.split.call(xs, '') : [].slice.call(xs);
    zs.sort(fn);
    return yesItsAString ? zs.join('') : zs;
  });

  register('maximumBy', function _maximumBy(f, xs) {
    return Nodash.foldl1(function (a, b) {
      if (f(a, b) > 0) {
        return a;
      }
      return b;
    }, xs);
  });

  register('minimumBy', function _minimumBy(f, xs) {
    return Nodash.foldl1(function (a, b) {
      if (f(a, b) < 0) {
        return a;
      }
      return b;
    }, xs);
  });


  /* Maybe */

  register('maybe', function _maybe(def, fun, maybe) {
    if (maybe === undefined || maybe === null) {
      return def;
    }
    return fun(maybe);
  });

  register('isJust', function _isJust(value) {
    return value !== undefined && value !== null;
  });

  register('isNothing', function _isNothing(value) {
    return value === undefined || value === null;
  });

  register('fromMaybe', function _fromMaybe(def, maybe) {
    if (maybe === undefined || maybe === null) {
      return def;
    }
    return maybe;
  });

  register('listToMaybe', function _listToMaybe(xs) {
    return xs[0];
  });

  register('maybeToList', function _maybeToList(maybe) {
    if (maybe === undefined || maybe === null) {
      return [];
    }
    return [maybe];
  });

  register('catMaybes', Nodash.filter(Nodash.isJust));

  register('mapMaybe', Nodash.compose2(Nodash.filter(Nodash.isJust), Nodash.map));


  /* Either */

  register('either', function _either(afun, bfun, either) {
    var left = either.left || either[0];
    if (left) {
      return afun(left);
    }
    var right = either.right || either[1];
    if (right) {
      return bfun(right);
    }
    return null;
  });

  register('Left', function _Left(value) {
    return { left: value };
  });

  register('Right', function _Right(value) {
    return { right: value };
  });

  register('isLeft', function _isLeft(val) {
    return val.left !== undefined ||
      (val[0] !== undefined && val[0] !== null);
  });

  register('isRight', function _isRight(val) {
    return (val.right !== undefined || val[1] !== undefined) &&
      !Nodash.isLeft(val);
  });

  register('fromLeft', function _fromLeft(val) {
    if (val.left !== undefined) {
      return val.left;
    }
    return val[0];
  });

  register('fromRight', function _fromRight(val) {
    if (val.right !== undefined) {
      return val.right;
    }
    return val[1];
  });

  register('lefts', Nodash.compose(
              Nodash.map(Nodash.fromLeft),
              Nodash.filter(Nodash.isLeft)
  ));

  register('rights', Nodash.compose(
              Nodash.map(Nodash.fromRight),
              Nodash.filter(Nodash.isRight)
  ));

  register('partitionEithers', function _partitionEithers(xs) {
    return Nodash.tuple(Nodash.lefts(xs), Nodash.rights(xs));
  });


  /* Objects */
  
  register('keys', Object.keys);

  register('values', function _values(object) {
    var values = [];
    each(function (value) {
      values.push(value);
    }, object);
    return values;
  });

  register('clone', function _clone(thing) {
    if (typeof thing === 'object') {
      if (thing === null) {
        return null;
      }
      return Nodash.map(Nodash.clone, thing);
    }
    return thing;
  });


  /* Control */

  register('async', function _async(f) {
    return function () {
      try {
        var callback = Nodash.last(arguments);
        var result = f.apply(null, Nodash.init(arguments));
        setImmediate(function () { callback(null, result); });
      } catch (e) {
        setImmediate(function () { callback(e); });
      }
    };
  });

  register('run', function _run(specification) {
    // this function does its own currying.
    if (arguments.length == 2) {
      Nodash.run(specification)(arguments[1]);
      return;
    }

    // if spec is an array, translate to object spec
    if (Nodash.isArray(specification)) {
      var prev = null;
      var newSpec = {};
      each(function (func, taskName) {
        newSpec[taskName] = prev === null ? func : [ prev, func ];
        prev = taskName;
      }, specification);
      specification = newSpec;
    }

    var tasks = {};
    var initial = [];

    // prepare tasks specification.
    each(function (spec, name) {
      var dependencies = [];
      var func = null;
      if (Nodash.isArray(spec)) {
        dependencies = Nodash.init(spec);
        func = Nodash.last(spec);
      } else {
        if (Nodash.isArray(spec.depends)) {
          dependencies = spec.depends;
        }
        func = spec;
      }

      var task = {
        func: func,
        args: dependencies,
        depends: {},
        enables: tasks[name] ? tasks[name].enables : {}
      };
      each(function (dependency) {
        task.depends[dependency] = true;
        if (!tasks[dependency]) {
            tasks[dependency] = { enables: {} };
        }
        tasks[dependency].enables[name] = true;
      }, dependencies);
      tasks[name] = task;
    }, specification);

    // check spec for unmet dependencies
    var unmetDependencies = [];
    each(function (task, taskName) {
      each(function (_, dependency) {
        if (!specification[dependency]) {
          unmetDependencies.push([ taskName, dependency ]);
        }
      }, task.depends);
    }, tasks);

    function mkError(message) {
      return function (callback) {
        setImmediate(function () {
          callback(message);
        });
      };
    }

    if (!Nodash.isEmpty(unmetDependencies)) {
      return mkError({
        message: 'unmet dependencies',
        details: Nodash.map(function (detail) {
          return '`' +
            detail[0] + '` depends on `' +
            detail[1] + '` which is not defined';
        }, unmetDependencies)
      });
    }

    // build initial set
    each(function (task, taskName) {
      if (Nodash.isEmpty(task.depends)) {
        initial.push(taskName);
      }
    }, tasks);

    if (Nodash.isEmpty(initial)) {
      return mkError({
        message: 'no initial task',
        details: 'There is no task without any dependencies.'
      });
    }

    // check spec for cycles
    var cycles = [];
    each(function (taskName) {

      var visited = {};
      var path = [];

      function visit(node) {
        path.push(node);
        if (visited[node]) {
          cycles.push(Nodash.map(Nodash.id, path));
        } else {
          visited[node] = true;
          each(visit, Object.keys(tasks[node].enables));
        }
        delete visited[path.pop()];
      }

      visit(taskName);

    }, initial);

    if (!Nodash.isEmpty(cycles)) {
      cycles = Nodash.map(function (cycle) {
        cycle = Nodash.dropWhile(Nodash.NEQ(Nodash.last(cycle)), cycle);
        return Nodash.reverse(cycle);
      }, cycles);
      return mkError({
        message: 'cycle detected',
        details: Nodash.map(Nodash.intercalate(' -> '), cycles)
      });
    }

    return function _runTasks(callback) {

      var depends = {},
          toGo = Nodash.length(tasks),
          results = Nodash.map(function (task, taskName) {
        return { toGo: Nodash.length(task.enables) };
      }, tasks);

      function callbackHandle(taskName) {
        return function (error, result) {
          if (!error) {
            results[taskName].result = result;
          } else {
            results[taskName].error = error;
          }

          // clean up results if need be
          each(function (_, dependency) {
            results[dependency].toGo -= 1;
            if (results[dependency].toGo === 0) {
              delete results[dependency];
            }
          }, tasks[taskName].depends);

          toGo -= 1;
          if (toGo === 0) {
            // clean results object
            each(function (result) {
              delete result.toGo;
            }, results);
            callback(null, results);
          } else {
            each(function (_, next) {
              delete depends[next][taskName];
              if (isEmpty(depends[next])) {
                execute(next);
              }
            }, tasks[taskName].enables);
          }
        };
      }

      function execute(taskName) {
        var task = tasks[taskName],
            callback = callbackHandle(taskName),
            dependenciesFailed = false,
            args = Nodash.map(function (dependency) {
              if (results[dependency].error) {
                dependenciesFailed = true;
              }
              return results[dependency].result;
            }, task.args);

        if (dependenciesFailed && Nodash.isFunction(task.func.runOnError)) {
          var tempResult = {};
          each(function (dependency) {
            var result = results[dependency];
            var stubResult = {};
            if (result.error) {
              stubResult.error = result.error;
            } else {
              stubResult.result = result.result;
            }
            tempResult[dependency] = stubResult;
          }, task.args);
          tempResult = task.func.runOnError(tempResult) || tempResult;
          args = Nodash.map(function (dependency) {
            return tempResult[dependency].result;
          }, task.args);
        }

        args.push(callback);

        setImmediate(function _executeTask() {
          if (dependenciesFailed && !task.func.runOnError) {
            callback({ message: 'dependencies failed' });
          } else {
            var f = task.func;
            if (Nodash.isObject(f)) {
              f = f.func;
            }
            try {
              f.apply(null, args);
            } catch (e) {
              callback(e);
            }
          }
        });
      }

      each(function (task, taskName) {
        depends[taskName] = Nodash.clone(task.depends);
      }, tasks);

      each(execute, initial);
    };
  });

  register('until', function _until(p, f, v) {
    while (!p(v)) {
      v = f(v);
    }
    return v;
  });

  register('pipe', function _pipe() {
    var functions, intermediateResult, callback;
    var error = null;
    if (Nodash.isArray(arguments[0])) {
      functions = arguments[0];
      callback = arguments[1];
    } else {
      functions = arguments;
    }
    if (functions.length > 0) {
      if (Nodash.isFunction(functions[0])) {
        intermediateResult = functions[0]();
      } else {
        intermediateResult = functions[0];
      }
      for (var i = 1; i < functions.length; i += 1) {
        try {
          intermediateResult = functions[i](intermediateResult);
        } catch (err) {
          error = err;
        }
      }
    }
    if (Nodash.isFunction(callback)) {
      callback(error, intermediateResult);
    } else if (error) {
      throw error;
    }
    return intermediateResult;
  });


  // group('Nodash');

  register('isNodash', function (thing) { return !!thing.__isNodash; });

  register('install', function _install(mountpoint) {
    var options = arguments[1];
    var nodashObject = Nodash;
    var prefix = '';
    var postfix = '';
    if (options) {
      nodashObject = makeNodash(options);
    }
    if (Nodash.isArray(mountpoint)) {
      if (Nodash.isString(mountpoint[0])) {
        prefix = [].shift.call(mountpoint);
      }
      if (Nodash.isString(mountpoint[1])) {
        postfix = mountpoint[1];
      }
      mountpoint = mountpoint[0] || {};
    }
    each(function (func, name) {
      if (!Nodash.isNodash(func)) {
        return;
      }
      mountpoint[prefix + name + postfix] = func;
    }, nodashObject);
    return mountpoint;
  });

  return Nodash;
}

var Nodash = makeNodash();

module.exports = Nodash;

if (typeof window !== 'undefined') {
  window.Nodash = Nodash;
}
