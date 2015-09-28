/* vim: set et sw=2 ts=2: */
/* global require */

// Save a reference to `Set` (if defined). Otherwise this variable will
// be `undefined`. References to some native types (`Math`, `Array`,
// `Object`) are kept here so that native objects can be distinguished
// from local polyfills.
var NativeSet    = typeof Set !== 'undefined' && Set;
var NativeMath   = Math;
var NativeString = String;

//function install(Nodash, Math, Array, Object, dontUseNatives, refObj, undefined) {
function makeNodash(options, undefined) {
  "use strict";

  options = options || {};

  // This is the object the nodash functions will be attached to.
  var Nodash = {};

  // Use either the supplied objects from the arguments,
  // or the references saved above.
  var Math   = options.Math   || NativeMath;
  var String = options.String || NativeString;

  var keys = Object.keys;
  var isArray = Array.isArray;

  // `isObject` checks whether a thing is an object and neither an
  // array nor null.
  var isObject = function _isObject(obj) {
    if (typeof obj === 'object') {
      return obj !== null && !isArray(obj);
    }
    return false;
  };

  // Utility functions for checking basic JavaScript types.
  function is(type, val)  { return val instanceof type; }
  function isFunction(x)  { return typeof x === 'function'; }
  function isString(x)    { return typeof x === 'string'; }
  function isNumber(x)    { return typeof x === 'number'; }
  function isBoolean(x)   { return typeof x === 'boolean'; }
  function isNodash(f)    { return isFunction(f) && f.__isNodash; }
  function isNumeric(x)   { return /^[0-9]+$/.test(x); }
  function isUndefined(x) { return x === undefined; }
  function isInteger(x) {
    return isNumber(x) && !isNaN(x) && x - Math.floor(x) === 0 && x !== Infinity && x !== -Infinity;
  }

  // Either use the native set or (if `dontUseNatives` is `true` or
  // there is no native set implementation) a drop-in replacement.
  // It reproduces only the actually used functionality, which is
  // `add` and `has`. It uses the keys of an object to simulate the Set.
  var Set = (!options.dontUseNatives && NativeSet) || (function () {
    
    var Set = function () {
      this.xs = {};
    };

    Set.prototype.add = function _Set_add(value) {
      this.xs[value] = true;
      return this;
    };

    Set.prototype.has = function _Set_has(value) {
      return this.xs[value] === true;
    };

    return Set;
  }());

  // A function to postpone an action on the event queue
  var trampoline = function (f) { setTimeout(f, 0); };
  if (!options.dontUseNatives && typeof(setImmediate) === 'function') {
    trampoline = setImmediate;
  }

  // The identity function that returns what was passed in unaltered.
  function id(x) { return x; }

  // A handy shorthand to reduce a list to a string.
  function arrayToString(x) { return x.join(''); }

  var indexOf = require('knuth-morris-pratt');

  // **Thunks**

  function Thunk(generator) {
    var self = this;
    this.get = function () {
      var value = generator();
      this.get = function () {
        return value;
      };
      return value;
    };
  }

  function isThunk(x) {
    return is(Thunk, x);
  }

  function resolveThunk(x) {
    if (isThunk(x)) {
      return x.get();
    }
    return x;
  }

  var curried = require('./lib/curried');

  /* @ifdef WITH_ONLINE_HELP */
  Nodash.metadata = [];

  var currentGroup = "";

  function group(name, desc) {
    currentGroup = { name: name };
  }

  function callsites() {
    var _ = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var stack = new Error().stack.slice(1);
    Error.prepareStackTrace = _;
    return stack;
  }
  
  function composed(f) {
    f.composed = f;
    return f;
  }
  /* @endif */

  // I would love to name this function `export` but that is a reserved keyword
  // since ECMA Script 5.
  function register() {
    var f, fCurried, i, arg, aliases = [];
    /* @ifdef WITH_ONLINE_HELP */
    var metadata = {};
    /* @endif */
    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      switch (typeof arg) {
      case 'string':
        aliases.push(arg);
        break;
      case 'function':
        f = arg;
        break;
      }
    }
    // if it is a constructor (starting with an upper case character)
    // it is not actually being curried (new XYZ() will not work otherwise).
    if (/^[A-Z]/.test(aliases[0][0])) {
      fCurried = f;
    } else {
      fCurried = curried(f.composed ? f() : f);
    }
    fCurried.__isNodash = true;
    for (i = 0; i < aliases.length; i++) {
      Nodash[aliases[i]] = fCurried;
    }
    /* @ifdef WITH_ONLINE_HELP */
    metadata.function = f;
    metadata.group = currentGroup;
    metadata.aliases = aliases;
    metadata.definedAt = callsites()[1].getPosition();
    Nodash.metadata.push(metadata);
    /* @endif */
    return fCurried;
  }

  
  // **Types**

  group('Types');

  register('isFunction', isFunction);
  register('isArray', isArray);
  register('isNumber', isNumber);
  register('isString', isString);
  register('isObject', isObject);
  register('isInteger', isInteger);
  register('isUndefined', isUndefined);
  register('isBoolean', isBoolean);
  register('is', is);


  group('Functions');

  register('id', id);

  function idf(x) {
    return function () {
      return x;
    };
  }
  register('idf', idf);

  register('const', 'const_', 'constant', function _const(a, b) {
    return a;
  });

  register('$', 'apply', function _apply(f, x) {
    return f(x);
  });

  register('invoke', function _invoke(f) {
    return f();
  });

  register('.', 'compose', function _compose(f, g, x) {
    return f(g(x));
  });

  register('compose2', function _compose2(f, g, x, y) {
    return f(g(x, y));
  });

  register('flip', function _flip(f) {
    return curried(function (b, a) {
      return f(a, b);
    });
  });

  register('on', function _on(g, f, a, b) {
    return g(f(a), f(b));
  });

  register('curried', curried);

  register('curry', function _curry(f) {
    return curried(function (a, b) {
      return f(tuple(a, b));
    });
  });

  register('uncurry', function _uncurry(f) {
    return function (t) {
      return f(fst(t), snd(t));
    };
  });


  // **Lists**

  group('Lists');
  
  function List(head, tail) {
    var self = this;
    this.head = function () {
      if (isThunk(head)) {
        var value = head.get();
        self.head = head.get;
        return value;
      }
      return head;
    };
    this.tail = function () {
      if (isThunk(tail)) {
        var value = tail.get();
        self.tail = tail.get;
        return value;
      }
      return tail;
    };
    this.isEmpty = idf(false);
  }
  List.prototype = {
    isEmpty: idf(false)
  };
  register('List', List);

  var emptyList = new List();
  emptyList.isEmpty = idf(true);

  register('singleton', function (x) { return new List(x, emptyList); });

  register('emptyList', function () { return emptyList; });

  function listToArray(xs) {
    if (isThunk(xs)) {
      xs = xs.get();
    }
    var array = [];
    each(function (x) {
      array.push(x);
    }, xs);
    return array;
  }
  register('listToArray', listToArray);

  var listToString = Nodash.compose(arrayToString, listToArray);
  register('listToString', listToString);
  

  // **Functions for working with boolean functions**

  group('Boolean');

  register('&&', 'AND', function _AND(a, b) { return a && b; });

  register('||', 'OR', function _OR(a, b) { return a || b; });

  register('not', function _not(value) { return !value; });

  register('bool', function _bool(yes, no, bool) {
    return bool ? yes : no;
  });


  // **Tuples**
  
  group('Tuples');

  function Tuple(fst, snd) {
    this.fst = idf(fst);
    this.snd = idf(snd);
  }
  register('Tuple', Tuple);

  function fst(t) {
    return t.fst();
  }
  register('fst', fst);

  function snd(t) {
    return t.snd();
  }
  register('snd', snd);

  function tuple(fst, snd) {
    return new Tuple(fst, snd);
  }
  register(',', 'tuple', 'pair', tuple);

  function tuple3(fst, snd, third) {
    return tuple(fst, tuple(snd, third));
  }
  register(',,', 'tuple3', tuple3);

  function tuple4(fst, snd, third, fourth) {
    return tuple3(fst, snd, tuple(third, fourth));
  }
  register(',,,', 'tuple4', tuple4);

  
  // **Eq**
  
  group("Comparisons");

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
      if (is(Tuple, a)) {
        return eq(fst(a), fst(b)) && eq(snd(a), snd(b));
      }
      var k = Nodash.union(keys(a), keys(b));
      for (var i = 0; i < k.length; i++) {
        if (!Nodash.eq(a[k[i]], b[k[i]])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  register('==', 'eq', 'EQ', eq);

  register('/=', '!=', '<>', 'neq', 'NEQ', function _neq(a, b) {
    return !eq(a, b);
  });


  // **Ord**

  register('compare', function _compare(a, b) {
    switch (typeof a) {
    case 'string':
      return a.localeCompare(b);
    case 'object':
      if (isFunction(a.compareTo)) {
        return a.compareTo(b);
      } else if (isArray(a)) {
        for (var i = 0; i < Math.min(a.length, b.length); i++) {
          var r = Nodash.compare(a[i], b[i]);
          if (r !== 0) {
              return r;
          }
        }
        return 0;
      }
      return a.toString().localeCompare(b.toString());
    case 'number':
      return Nodash.signum(a - b);
    }
    return undefined;
  });

  register('<', 'lt', 'LT', function _lt(a, b) {
    return Nodash.compare(a, b) < 0;
  });

  register('>', 'gt', 'GT', function _gt(a, b) {
    return Nodash.compare(a, b) > 0;
  });

  register('<=', 'lte', 'LTE', function _lte(a, b) {
    return Nodash.compare(a, b) <= 0;
  });

  register('>=', 'gte', 'GTE', function _gte(a, b) {
    return Nodash.compare(a, b) >= 0;
  });

  register('max', function _max(a, b) {
    if (Nodash.gt(a, b)) {
      return a;
    }
    return b;
  });

  register('min', function _min(a, b) {
    if (Nodash.lt(a, b)) {
      return a;
    }
    return b;
  });

  register('comparing', function _comparing(f, a, b) {
    return Nodash.compare(f(a), f(b));
  });


  // **Characters**

  group('Characters');
  
  register('isDigit', 'isNumeric', isNumeric);

  register('isAsciiLetter', function _isAsciiLetter(x) {
    return /^[a-zA-Z]+$/.test(x);
  });

  register('isLetter', function _isLetter(x) {
    var xUpper = x.toUpperCase();
    var xLower = x.toLowerCase();
    for (var i = 0; i < x.length; i += 1) {
      if (xUpper[i] === xLower[i]) {
        return false;
      }
    }
    return true;
  });

  register('isUpper', function _isLetter(x) {
    var xUpper = x.toUpperCase();
    var xLower = x.toLowerCase();
    for (var i = 0; i < x.length; i += 1) {
      if (xUpper[i] === xLower[i] || x[i] !== xUpper[i]) {
        return false;
      }
    }
    return true;
  });
  
  register('isLower', function _isLetter(x) {
    var xUpper = x.toUpperCase();
    var xLower = x.toLowerCase();
    for (var i = 0; i < x.length; i += 1) {
      if (xUpper[i] === xLower[i] || x[i] !== xLower[i]) {
        return false;
      }
    }
    return true;
  });

  register('ord', function _ord(x) {
    return x.charCodeAt(0);
  });

  register('chr', function _chr(x) {
    return String.fromCharCode(x);
  });


  // Num

  group('Numbers');

  register('+', 'add', 'ADD', 'plus', 'PLUS', function _add(a, b) {
    return a + b;
  });

  register('-', 'sub', 'minus', 'MINUS', 'subtract', function _sub(a, b) {
    return a - b;
  });

  register('*', 'mul', 'MUL', 'times', 'TIMES', function _mul(a, b) {
    return a * b;
  });

  register('abs', Math.abs);

  register('negate', function _negate(a) { return -a; });

  register('signum', function _signum(x) {
    if (x > 0) {
      return 1;
    } else if (x === 0) {
      return 0;
    }
    return -1;
  });


  // Integral

  register('div', function _div(a, b) { return Math.floor(a / b); });

  register('quot', function _quot(a, b) {
    var r = a / b;
    return r >= 0 ? Math.floor(r) : Math.ceil(r);
  });

  register('rem', function _rem(a, b) { return a % b; });

  register('mod', function _mod(a, b) {
    var q = Nodash.quot(a, b);
    var r = Nodash.rem(a, b);
    return Nodash.signum(r) == -Nodash.signum(b) ? r + b : r;
  });

  register('divMod', function _divMod(a, b)  {
    return [Nodash.div(a, b), Nodash.mod(a, b)];
  });

  register('quotRem', function _quotRem(a, b) {
    return [Nodash.quot(a, b), Nodash.rem(a, b)];
  });


  // Fractional

  register('/', 'frac', function _frac(a, b) { return a / b; });

  register('recip', function _recip(a) { return 1 / a; });


  // Floating

  register('exp', Math.exp);

  register('sqrt', Math.sqrt);

  register('log', Math.log);

  register('logBase', function _logBase(a, b) {
    return Math.log(a) / Math.log(b);
  });

  register('**', 'pow', '^', '^^', Math.pow);

  register('sin', Math.sin);

  register('tan', Math.tan);

  register('cos', Math.cos);

  register('asin', Math.asin);

  register('atan', Math.atan);

  register('acos', Math.acos);

  register('sinh', Math.sinh || function _sinh(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
  });

  register('tanh', Math.tanh || function _tanh(x) {
    if (x === Infinity) {
      return 1;
    } else if (x === -Infinity) {
      return -1;
    } else {
      return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
    }
  });

  register('cosh', Math.cosh || function _cosh(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
  });

  register('asinh', Math.asinh || function _asinh(x) {
    if (x === -Infinity) {
      return x;
    } else {
      return Math.log(x + Math.sqrt(x * x + 1));
    }
  });

  register('atanh', Math.atanh || function _atanh(x) {
    return Math.log((1 + x) / (1 - x)) / 2;
  });

  register('acosh', Math.acosh || function _acosh(x) {
    return Math.log(x + Math.sqrt(x * x - 1));
  });


  // RealFrac

  register('properFraction', function _properFraction(x) {
    var num = Nodash.truncate(x);
    return [ num, -(num - x) ];
  });

  register('truncate', Math.trunc || function _truncate(x) {
    switch (Nodash.signum(x)) {
    case -1:
      return Math.ceil(x);
    case 1:
      return Math.floor(x);
    }
    return 0;
  });

  register('round', function _round(x) {
    var fraction = Nodash.properFraction(x);
    var n = fraction[0];
    var m = fraction[1] < 0 ? n - 1 : n + 1;
    switch (Nodash.signum(Math.abs(fraction[1]) - 0.5)) {
      case -1:
        return n;
      case 0:
        return n % 2 === 0 ? n : m;
      case 1:
        return m;
    }
  });

  register('ceiling', Math.ceil);

  register('floor', Math.floor);


  // RealFloat

  /* ... */


  // Numeric

  register('gcd', function _gcd(a, b) {
    var c;
    while (b !== 0) {
      c = Nodash.rem(a, b);
      a = b;
      b = c;
    }
    return a;
  });

  register('lcm', function _lcm(a, b) {
    if (a === 0 || b === 0) {
      return 0;
    }
    return Math.abs(Nodash.quot(a, Nodash.gcd(a, b)) * b);
  });

  register('even', function _even(x) { return (x % 2) === 0; });

  register('odd', function _odd(x) { return (x % 2) !== 0; });


  group('Streams');

  function Stream(generator) {
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
  Stream.prototype = new List();
  Stream.prototype.isEmpty = idf(false);
  register('Stream', Stream);

  function stream(generator) {
    return new Stream(generator);
  }
  register('stream', stream);

  function lazy(val) {
    if (isFunction(val)) {
      return new Thunk(val);
    }
    if (!isArray(val) && !isString(val)) {
      return;
    }
    function generator(i) {
      if (i < val.length) {
        return new List(val[i], new Thunk(function () {
          return generator(i + 1);
        }));
      }
      return emptyList;
    }
    return generator(0);
  }
  register('lazy', lazy);

  function each(f, xs) {
    if (isThunk(f)) {
      f = f.get();
    }
    if (isThunk(xs)) {
      xs = xs.get();
    }
    if (is(List, xs)) {
      while (!xs.isEmpty()) {
        f(xs.head());
        xs = xs.tail();
      }
    } else if (isArray(xs) || isString(xs)) {
      for (var i = 0; i < xs.length; i++) {
        f(xs[i], i);
      }
    } else if (isObject(xs)) {
      var ks = keys(xs);
      for (var j = 0; j < ks.length; j += 1) {
        f(xs[ks[j]], ks[j]);
      }
    }
  }
  register('each', each);

  register('repeat', function (x) {
    function generator() {
      return tuple(x, generator);
    }
    return stream(generator);
  });

  register('iterate', function (f, seed) {
    function generator(seed) {
      return function () {
        var newSeed = f(seed);
        return tuple(seed, generator(newSeed));
      };
    }
    return stream(generator(seed));
  });

  register('cycle', function (xs) {
    if (isArray(xs)) {
      xs = lazy(xs);
    }
    function generator(ys) {
      if (ys.isEmpty()) {
        ys = xs;
      }
      return function () {
        return tuple(ys.head(), generator(ys.tail()));
      };
    }
    return stream(generator(xs));
  });

  
  group('Strings');

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


  group('Collections');

  register(':', 'cons', function _cons(x, xs) {
    if (is(List, xs)) {
      return new List(x, xs);
    }
    var zs = [x];
    [].push.apply(zs, xs);
    return zs;
  });

  register('++', 'append', function _append(xs, ys) {
    
    if (isString(xs)) {
      return xs + ys;
    }
    // TODO: the assumption is that it is an array now
    return [].concat.call(xs, ys);
  });

  register('map', function _map(f, xs) {
    var i, ys;
    if (isArray(xs)) {
      ys = [];
      for (i = 0; i < xs.length; i++) {
        ys.push(f(xs[i]));
      }
      return ys;
    }
    if (isString(xs)) {
      ys = [];
      for (i = 0; i < xs.length; i++) {
        ys.push(f(xs[i]));
      }
      return arrayToString(ys);
    }
    ys = {};
    var ks = keys(xs);
    for (var j = 0; j < ks.length; j++) {
      ys[ks[j]] = f(xs[ks[j]], ks[j]);
    }
    return ys;
  });

  register('filter', function _filter(p, xs) {
    var ys;
    if (isArray(xs) || isString(xs)) {
      ys = [];
      for (var i = 0; i < xs.length; i++) {
        if (p(xs[i])) {
          ys.push(xs[i]);
        }
      }
      return isString(xs) ? arrayToString(ys) : ys;
    }
    ys = {};
    var ks = keys(xs);
    for (var j = 0; j < ks.length; j++) {
      if (p(xs[ks[j]])) {
        ys[ks[j]] = xs[ks[j]];
      }
    }
    return ys;
  });

  register('head', function _head(xs) {
    if (is(List, xs)) {
      return xs.head();
    }
    return xs[0];
  });

  register('last', function _last(xs) {
    return xs[xs.length - 1];
  });

  register('tail', function _tail(xs) {
    if (is(List, xs)) {
      return xs.tail();
    }
    if (isString(xs)) {
      return xs.slice(1);
    }
    return [].slice.call(xs, 1);
  });

  register('init', function _init(xs) {
    if (isString(xs)) {
      return xs.slice(0, xs.length - 1);
    }
    return [].slice.call(xs, 0, xs.length - 1);
  });

  function isEmpty(xs) {
    if (is(List, xs) && xs.isEmpty()) {
      return true;
    }
    if (isArray(xs) || isString(xs)) {
      return xs.length === 0;
    }
    for (var _ in xs) {
      return false;
    }
    return true;
  }
  register('isEmpty', 'null_', isEmpty);

  register('length', function _length(xs) {
    if (isObject(xs)) {
      return keys(xs).length;
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
    var zs = isString(xs) ? "".split.call(xs, '') : [].slice.call(xs);
    zs.reverse();
    return isString(xs) ? zs.join('') : zs;
  });

  function take(n, xs) {
    if (isArray(xs) || isString(xs)) {
      return xs.slice(0, n);
    }
    function generator(i, xs) {
      if (i <= 0 || xs.isEmpty()) {
        return emptyList;
      }
      return new List(xs.head(), new Thunk(function () {
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
    return tuple(take(n, xs), drop(n, xs));
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
    return tuple(xs.slice(0, i), xs.slice(i));
  });

  register('break_', 'break', function _break(p, xs) {
    var i = 0;
    while (i < xs.length && !p(xs[i])) {
      i++;
    }
    return tuple(xs.slice(0, i), xs.slice(i));
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
    if (isArray(xs)) {
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

  register('and', composed(function (){return Nodash.foldl(Nodash.AND, true);}));

  register('or', composed(function (){return Nodash.foldl(Nodash.OR, false);}));

  register('sum', composed(function (){return Nodash.foldl(Nodash.ADD, 0);}));

  register('product', composed(function (){return Nodash.foldl(Nodash.MUL, 1);}));

  register('maximum', composed(function (){return Nodash.foldl(Nodash.max, -Infinity);}));

  register('minimum', composed(function (){return Nodash.foldl(Nodash.min, +Infinity);}));

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
    if (isString(xs[0])) {
      return xs.join('');
    }
    var zs = [];
    var ks = keys(xs);
    for (var i = 0; i < ks.length; i++) {
      [].push.apply(zs, xs[ks[i]]);
    }
    return zs;
  });

  register('concatMap', composed(function (){return Nodash.compose2(Nodash.concat, Nodash.map);}));

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

  register('zip', composed(function (){return Nodash.zipWith(Nodash.tuple);}));

  register('zip3', composed(function (){return Nodash.zipWith3(Nodash.tuple3);}));

  register('zip4', composed(function (){return Nodash.zipWith4(Nodash.tuple4);}));

  
  // further from Data.List

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
    if (!isArray(xss)) {
      var zss = {};
      var ks = keys(xss);
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
    if (isString(xss[0])) {
      zs = Nodash.map(arrayToString, zs);
    }
    return zs;
  });

  register('inits', function _inits(xs) {
    var result, current, i, length;
    if (isArray(xs)) {
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
    if (isArray(xs)) {
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
    if (isString(xs)) {
      return tuple(arrayToString(as), arrayToString(bs));
    }
    return tuple(as, bs);
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
    return isString(xs) ? arrayToString(zs) : zs;
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
    var zs = isString(xs) ? "".split.call(xs, '') : [].slice.call(xs);
    if (isNumber(zs[0])) {
      zs.sort(function (a, b) { return a - b; });
    } else if (isString(zs[0])) {
      zs.sort(function (a, b) { return a.localeCompare(b); });
    } else {
      zs.sort(Nodash.compare);
    }
    return isString(xs) ? zs.join('') : zs;
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

  register('insert', composed(function (){return Nodash.insertBy(Nodash.compare);}));

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
    return isString(xs) ? Nodash.map(arrayToString, zs) : zs;
  });

  register('group', composed(function (){return Nodash.groupBy(Nodash.eq);}));

  register('sortBy', function _sortBy(fn, xs) {
    if (xs.length <= 1) {
      return xs;
    }
    var yesItsAString = isString(xs);
    var zs = yesItsAString ? "".split.call(xs, '') : [].slice.call(xs);
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


  // **Maybe**

  group('Maybe');

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

  register('catMaybes', composed(function (){return Nodash.filter(Nodash.isJust);}));

  register('mapMaybe', composed(function (){return Nodash.compose2(Nodash.filter(Nodash.isJust), Nodash.map);}));


  // **Either**

  group('Either');

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
    return tuple(Nodash.lefts(xs), Nodash.rights(xs));
  });


  // **Objects**
  
  group('Objects');

  register('keys', keys);

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


  // ## Control

  group('Control');

  register('async', function _async(f) {
    return function () {
      try {
        var callback = Nodash.last(arguments);
        var result = f.apply(null, Nodash.init(arguments));
        trampoline(function () { callback(null, result); });
      } catch (e) {
        trampoline(function () { callback(e); });
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
    if (isArray(specification)) {
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
      if (isArray(spec)) {
        dependencies = Nodash.init(spec);
        func = Nodash.last(spec);
      } else {
        if (isArray(spec.depends)) {
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
        trampoline(function () {
          callback(message);
        });
      };
    }

    if (!Nodash.isEmpty(unmetDependencies)) {
      return mkError({
        message: "unmet dependencies",
        details: Nodash.map(function (detail) {
          return "`" +
            detail[0] + "` depends on `" +
            detail[1] + "` which is not defined";
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
        message: "no initial task",
        details: "There is no task without any dependencies."
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
          cycles.push(Nodash.map(id, path));
        } else {
          visited[node] = true;
          each(visit, keys(tasks[node].enables));
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
        message: "cycle detected",
        details: Nodash.map(Nodash.intercalate(" -> "), cycles)
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

        if (dependenciesFailed && isFunction(task.func.runOnError)) {
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

        trampoline(function _executeTask() {
          if (dependenciesFailed && !task.func.runOnError) {
            callback({ message: "dependencies failed" });
          } else {
            var f = task.func;
            if (isObject(f)) {
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
    if (isArray(arguments[0])) {
      functions = arguments[0];
      callback = arguments[1];
    } else {
      functions = arguments;
    }
    if (functions.length > 0) {
      if (isFunction(functions[0])) {
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
    if (isFunction(callback)) {
      callback(error, intermediateResult);
    } else if (error) {
      throw error;
    }
    return intermediateResult;
  });


  group('Nodash');

  register('isNodash', isNodash);

  register('install', function _install(mountpoint) {
    var options = arguments[1];
    var nodashObject = Nodash;
    var prefix = '';
    var postfix = '';
    if (options) {
      nodashObject = makeNodash(options);
    }
    if (isArray(mountpoint)) {
      if (isString(mountpoint[0])) {
        prefix = [].shift.call(mountpoint);
      }
      if (isString(mountpoint[1])) {
        postfix = mountpoint[1];
      }
      mountpoint = mountpoint[0] || {};
    }
    each(function (func, name) {
      if (!isNodash(func)) {
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
