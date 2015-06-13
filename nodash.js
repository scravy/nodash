/* vim: set et sw=2 ts=2: */
(function () {

// Save a reference to `Set` (if defined). Otherwise this variable will
// be `undefined`. References to some native types are kept here so that
// native objects can be distinguished from local polyfills.
var NativeSet    = typeof Set !== 'undefined' && Set;

// Save a reference to the `Math` object.
var NativeMath   = Math;

// Save a reference to the `Array` object.
var NativeArray  = Array;

// Save a reference to the `Object` object.
var NativeObject = Object;

function install(Nodash, Math, Array, Object, dontUseNativeSet, refObj, undefined) {
  "use strict";

  // Use either the supplied `Math` object from the arguments,
  // if none given the `NativeMath` object.
  Math   = Math   || NativeMath;

  // Use either the supplied `Array` object from the arguments,
  // if none given the `NativeArray` object.
  Array  = Array  || NativeArray;

  // Use either the supplied `Object` object from the arguments,
  // if none given the `NativeObject` object.
  Object = Object || NativeObject;

  // This is the object the nodash functions will be attached to.
  // If none is given, just use a new empty object (this is the
  // object which will be returned eventually).
  Nodash = Nodash || {};

  function showEndOfStream() {
    return "end of stream";
  }

  // This is a special object used to mark the end of a stream.
  // It is used as a kind of unique symbol. The eos variable itself
  // is not exported and can not be written to from the outside.
  var eos = {
    toString: showEndOfStream,
    inspect: showEndOfStream
  };

  // The reference on the other hand is exported as `endOfStream`.
  // While it is technically possible to overwrite `endOfStream` from
  // the outside this will not affect the `eos` variable within this
  // closure.
  Nodash.endOfStream = eos;

  // This is a plain object which is only available within this
  // clojure. It is used as a kind of unique symbol to be identified
  // by comparing references via `===`.
  var stream = {};

  // Creates a (finite) stream from a function f. This function
  // is meant to be used internally (within this closure) only.
  // A function is marked as stream by simply attaching the `stream`
  // object as `__stream__`.
  function mkStream(f) {
    f.__stream__ = stream;
    return f;
  }

  // Creates an infinite stream from a function f. This function
  // is meant to be used internally only.
  function mkInfinite(f) {
    // It creates a strean by invoking `mkStream` and then marks it
    // as infinite by attaching `true` as `__infinite__`.
    f = mkStream(f);
    f.__infinite__ = true;
    return f;
  }

  // Check whether a stream is infinite by checking for the
  // `__infinite__` property.
  function isInfinite(f) {
    return !!f.__infinite__;
  }

  // Check whether a stream is finite and raise an error if it is not.
  // This function is meant to be used internally only to have functions
  // accepting finite streams only check their arguments.
  function checkFinite(xs) {
    if (isInfinite(xs)) {
      throw new Error('this function can not consume infinite streams');
    }
  }

  // `isArray` checks whether a thing is actually an array object.
  // If `Array.isArray` is not available in this environment it will
  // fall back to comparing the toString representation. The `toString`
  // method used is the one from the `NativeObject` to make sure that
  // client code can not temper with an object and make it look like an
  // array. The fallback is necessary to cope with legacy browser
  // environments.
  var isArray = Array.isArray || function _isArray(arr) {
    return NativeObject.prototype.toString.call(arr) === '[object Array]';
  };

  // Check whether a thing is actually a function.
  function isFunction(x) { return typeof x === 'function'; }

  // Check whether a thing is actually a string.
  function isString(x)   { return typeof x === 'string'; }

  // Check whether a thing is actually a number.
  function isNumber(x)   { return typeof x === 'number'; }

  // Check whether a thing is actually a stream.
  function isStream(x)   { return isFunction(x) && x.__stream__ === stream; }

  var keys = Object.keys || (function() {
    var hasOwnProperty = NativeObject.prototype.hasOwnProperty,
        hasDontEnumBug = !(refObj || { toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function _Object_keys(obj) {
      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }
      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());

  var Set = (!dontUseNativeSet && NativeSet) || (function () {
    
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

  function id(x) { return x; }

  function listToString(x) { return x.join(''); }

  // `indexOf` uses an implementation of the Knuth-Morrison-Pratt
  // Algorithm for finding the index of a given subsequence
  // (identified as `word` here) within a sequence (identified as
  // `string` here).
  function indexOf(word, string) {
    var m = 0;
    var i = 0;
    var table = [];

    var pos = 2;
    var cnd = 0;

    table[0] = -1;
    table[1] = 0;

    while (pos < word.length) {
      if (word[pos - 1] == word[cnd]) {
        cnd = cnd + 1;
        table[pos] = cnd;
        pos = pos + 1;
      } else if (cnd > 0) {
        cnd = table[cnd];
      } else {
        table[pos] = 0;
        pos = pos + 1;
      }
    }
    
    while (m + i < string.length) {
      if (word[i] == string[m + i]) {
        if (i == word.length - 1) {
          return m;
        }
        i = i + 1;
      } else {
        if (table[i] > -1) {
          m = m + i - table[i];
          i = table[i];
        } else {
          i = 0;
          m = m + 1;
        }
      }
    }
    return -1;
  }

  var funcs = {

    0: id,
    1: id,
    2: function (fn) {
      return function (a, b) {
        switch (arguments.length) {
        case 1:
          return function (b) {
            return fn(a, b);
          };
        }
        return fn(a, b);
      };
    },
    3: function (fn) {
      return function (a, b, c) {
        switch (arguments.length) {
        case 1:
          return funcs[2](function (b, c) {
            return fn(a, b, c);
          });
        case 2:
          return function (c) {
            return fn(a, b, c);
          };
        }
        return fn(a, b, c);
      };
    },
    4: function (fn) {
      return function (a, b, c, d) {
        switch (arguments.length) {
        case 1:
          return funcs[3](function (b, c, d) {
            return fn(a, b, c, d);
          });
        case 2:
          return funcs[2](function (c, d) {
            return fn(a, b, c, d);
          });
        case 3:
          return function (d) {
            return fn(a, b, c, d);
          };
        }
        return fn(a, b, c, d);
      };
    },
    5: function (fn) {
      return function (a, b, c, d, e) {
        switch (arguments.length) {
        case 1:
          return funcs[4](function (b, c, d, e) {
            return fn(a, b, c, d, e);
          });
        case 2:
          return funcs[3](function (c, d, e) {
            return fn(a, b, c, d, e);
          });
        case 3:
          return funcs[2](function (d, e) {
            return fn(a, b, c, d, e);
          });
        case 4:
          return function (e) {
            return fn(a, b, c, d, e);
          };
        }
        return fn(a, b, c, d, e);
      };
    },
    6: function (fn) {
      return function (a, b, c, d, e, f) {
        switch (arguments.length) {
        case 1:
          return funcs[5](function (b, c, d, e, f) {
            return fn(a, b, c, d, e, f);
          });
        case 2:
          return funcs[4](function (c, d, e, f) {
            return fn(a, b, c, d, e, f);
          });
        case 3:
          return funcs[3](function (d, e, f) {
            return fn(a, b, c, d, e, f);
          });
        case 4:
          return funcs[2](function (e, f) {
            return fn(a, b, c, d, e, f);
          });
        case 5:
          return function (f) {
            return fn(a, b, c, d, e, f);
          };
        }
        return fn(a, b, c, d, e, f);
      };
    },
    7: function (fn) {
      return function (a, b, c, d, e, f, g) {
        switch (arguments.length) {
        case 1:
          return funcs[6](function (b, c, d, e, f, g) {
            return fn(a, b, c, d, e, f, g);
          });
        case 2:
          return funcs[5](function (c, d, e, f, g) {
            return fn(a, b, c, d, e, f, g);
          });
        case 3:
          return funcs[4](function (d, e, f, g) {
            return fn(a, b, c, d, e, f, g);
          });
        case 4:
          return funcs[3](function (e, f, g) {
            return fn(a, b, c, d, e, f, g);
          });
        case 5:
          return funcs[2](function (f, g) {
            return fn(a, b, c, d, e, f, g);
          });
        case 6:
          return function (g) {
            return fn(a, b, c, d, e, f, g);
          };
        }
        return fn(a, b, c, d, e, f, g);
      };
    },
    8: function (fn) {
      return function (a, b, c, d, e, f, g, h) {
        switch (arguments.length) {
        case 1:
          return funcs[7](function (b, c, d, e, f, g, h) {
            return fn(a, b, c, d, e, f, g, h);
          });
        case 2:
          return funcs[6](function (c, d, e, f, g, h) {
            return fn(a, b, c, d, e, f, g, h);
          });
        case 3:
          return funcs[5](function (d, e, f, g, h) {
            return fn(a, b, c, d, e, f, g, h);
          });
        case 4:
          return funcs[4](function (e, f, g, h) {
            return fn(a, b, c, d, e, f, g, h);
          });
        case 5:
          return funcs[3](function (f, g, h) {
            return fn(a, b, c, d, e, f, g, h);
          });
        case 6:
          return funcs[2](function (g, h) {
            return fn(a, b, c, d, e, f, g, h);
          });
        case 7:
          return function (h) {
            return fn(a, b, c, d, e, f, g, h);
          };
        }
        return fn(a, b, c, d, e, f, g, h);
      };
    }
  };

  Nodash.curried = function (fn) { return funcs[fn.length](fn); };

  Nodash.functions = {};

  Nodash.pipe = function () {
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
  };

  function register() {
    var f, i, arg, aliases = [], name;
    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      switch (typeof arg) {
      case 'string':
        name = name || arg;
        aliases.push(arg);
        break;
      case 'function':
        f = Nodash.curried(arg);
        break;
      }
    }
    for (i = 0; i < aliases.length; i++) {
      Nodash[aliases[i]] = f;
    }
    aliases.shift();
    Nodash.functions[name] = {
      aliases: aliases,
      arity: f.length
    };
    return f;
  }

  // Exports utility functions.
  
  register('isFunction', isFunction);
  register('isStream', isStream);
  register('isArray', isArray);
  register('isNumber', isNumber);
  register('isInfinite', isInfinite);

  
  // Exports/Defines of functions dealing with functions.

  // The identify function just returns what was passed in immediately.
  register('id', id);

  // Since JavaScript is a strict language `idf` is provided. It wrapes
  // the argument given to it in a function which will always return
  // that value. A handy application is to define infinite streams,
  // for example `stream(idf(7))`.
  register('idf', function _idf(x) {
    return function () {
      return x;
    };
  });

  // The const function accepts a first and a second argument and
  // discards the latter one. It is mostly used as a section
  // (partial application) to discard some input in a pipe and
  // return a fixed value.
  register('const', 'const_', 'constant', function _const(a, b) {
    return a;
  });

  // Applies the function given as first argument to the argument given
  // as second argument. This seemingly useless function is handy
  // to make function application explicit, e.g. when building using
  // `fold` or `zipWith`.
  register('$', 'apply', function _apply(f, x) {
    return f(x);
  });

  // 
  register('.', 'compose', function _compose(f, g, x) {
    return f(g(x));
  });

  register('compose2', function _compose2(f, g, x, y) {
    return f(g(x, y));
  });

  register('flip', function _flip(f) {
    return funcs[2](function (b, a) {
      return f(a, b);
    });
  });

  register('on', function _on(g, f, a, b) {
    return g(f(a), f(b));
  });


  // Bool

  register('&&', 'AND', function _AND(a, b) { return a && b; });

  register('||', 'OR', function _OR(a, b) { return a || b; });

  register('not', function _not(value) { return !value; });

  register('bool', function _bool(yes, no, bool) {
    return bool ? yes : no;
  });


  // Tuple

  register('fst', function _fst(arr) { return arr[0]; });

  register('snd', function _snd(arr) { return arr[1]; });

  register(',', function (a, b) { return [ a, b ]; });

  register(',,', function (a, b, c) { return [ a, b, c ]; });

  register(',,,', function (a, b, c, d) { return [ a, b, c, d ]; });

  register(',,,,', function (a, b, c, d, e) {
    return [ a, b, c, d, e ];
  });

  register(',,,,,', function (a, b, c, d, e, f) {
    return [ a, b, c, d, e, f ];
  });

  register(',,,,,,', function (a, b, c, d, e, f, g) {
    return [ a, b, c, d, e, f, g ];
  });


  // Eq

  register('==', 'eq',  'EQ', function _eq(a, b) {
    if (a === b) {
      return true;
    }
    var ta = typeof a;
    var tb = typeof b;
    if (ta !== tb) {
      return false;
    }
    if (ta === 'object') {
      var k = Nodash.union(keys(a), keys(b));
      for (var i = 0; i < k.length; i++) {
        if (!Nodash.eq(a[k[i]], b[k[i]])) {
          return false;
        }
      }
      return true;
    }
    return false;
  });

  register('/=', 'neq', 'NEQ', function _neq(a, b) {
    return !Nodash.eq(a, b);
  });


  // Ord

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


  // Data.Char
  
  register('isDigit', function (x) {
    return !!x.match(/[0-9]/);
  });

  register('isAsciiLetter', function (x) {
    return !!x.match(/[a-zA-Z]/);
  });


  // Num

  register('+', 'add', 'ADD', 'plus', 'PLUS', function _add(a, b) {
    return a + b;
  });

  register('-', 'sub', 'SUB', 'minus', 'MINUS', 'subtract', function _sub(a, b) {
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

  register('divMod',  function _divMod(a, b)  {
    return [Nodash.div(a, b), Nodash.mod(a, b)];
  });

  register('quotRem', function _quotRem(a, b) {
    return [Nodash.quot(a, b), Nodash.rem(a, b)];
  });


  // Fractional

  register('/', 'frac', function _frac(a, b) { return a / b; });

  register('recip', function _recip(a) { return 1 / a; });


  // Floating

  register('exp',  Math.exp);

  register('sqrt', Math.sqrt);

  register('log',  Math.log);

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

  register('tanh', Math.tanh || function(x) {
    if (x === Infinity) {
      return 1;
    } else if (x === -Infinity) {
      return -1;
    } else {
      return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
    }
  });

  register('cosh', Math.cosh || function(x) {
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
    // Haskell's round and JavaScripts Math.round are different
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


  // Control

  register('until', function _until(p, f, v) {
    while (!p(v)) {
      v = f(v);
    }
    return v;
  });


  // Stream

  register('stream', 'lazy', function _stream(xs) {
    if (isStream(xs)) {
      return xs;
    }
    if (isFunction(xs)) {
      return mkInfinite(function () {
        return xs();
      });
    }
    var i = 0;
    return mkStream(function () {
      if (i < xs.length) {
        return xs[i++];
      }
      return eos;
    });
  });

  register('consume', function _consume(xs) {
    if (!isStream(xs)) {
      return xs;
    }
    checkFinite(xs);
    var z, zs = [];
    while ((z = xs()) !== eos) {
      zs.push(z);
    }
    return zs;
  });

  register('consumeString', function _consumeString(xs) {
    if (!isStream(xs)) {
      return "" + xs;
    }
    var z, zs = "";
    while ((z = xs()) !== eos) {
      zs += z;
    }
    return zs;
  });

  register('each', function _each(f, xs) {
    if (isStream(xs)) {
      var x;
      while ((x = xs()) !== eos) {
        f(x);
      }
    } else if (isArray(xs) || isString(xs)) {
      for (var i = 0; i < xs.length; i++) {
        f(xs[i]);
      }
    } else {
      var ks = keys(xs);
      for (var j = 0; j < ks.length; j += 1) {
        f(xs[ks[j]], ks[j]);
      }
    }
  });

  register('cycle', function _cycle(xs) {
    if (isStream(xs)) {
      if (isInfinite(xs)) {
        return xs;
      }
      var arr = [];
      var consumed = false;
      var h = 0;
      return mkInfinite(function () {
        var z;
        if (!consumed) {
          if ((z = xs()) !== eos) {
            arr.push(z);
            return z;
          }
          consumed = true;
        }
        if (h >= arr.length) {
          h = 0;
        }
        return arr[h++];
      });
    } else if (isArray(xs) || isString(xs)) {
      var i = 0;
      return mkInfinite(function () {
        if (i >= xs.length) {
          i = 0;
        }
        return xs[i++];
      });
    } else {
      var ks = keys(xs);
      var j = 0;
      return mkInfinite(function () {
        if (j >= ks.length) {
          j = 0;
        }
        return xs[ks[j++]];
      });
    }
  });

  register('repeat', function _repeat(x) {
    return mkInfinite(function () {
      return x;
    });
  });

  register('iterate', function _iterate(f, x) {
    return mkInfinite(function () {
      var r = x;
      x = f(x);
      return r;
    });
  });


  // List

  register(':', 'cons', function _cons(x, xs) {
    if (isStream(xs)) {
      var consumedFirst = false;
      return (isInfinite(xs) ? mkInfinite : mkStream)(function () {
        if (!consumedFirst) {
          consumedFirst = true;
          return x;
        }
        return xs();
      });
    }
    var zs = [x];
    [].push.apply(zs, xs);
    return zs;
  });

  register('++', 'append', function _append(xs, ys) {
    if (isStream(xs) || isStream(ys)) {
      xs = Nodash.stream(xs);
      if (isInfinite(xs)) {
        return xs;
      }
      ys = Nodash.stream(ys);
      var atSecondStream = false;
      return mkStream(function () {
        if (atSecondStream) {
          return ys();
        }
        var r = xs();
        if (r == eos) {
          atSecondStream = true;
          return ys();
        }
        return r;
      });
    }
    if (isString(xs)) {
      return xs + ys;
    }
    var zs = [];
    [].push.apply(zs, xs);
    [].push.apply(zs, ys);
    return zs;
  });

  register('map', function _map(f, xs) {
    if (isStream(xs)) {
      return (isInfinite(xs) ? mkInfinite : mkStream)(function () {
        var x = xs();
        if (x === eos) {
          return eos;
        }
        return f(x);
      });
    }
    var ys;
    if (isArray(xs) || isString(xs)) {
      ys = [];
      for (var i = 0; i < xs.length; i++) {
        ys.push(f(xs[i]));
      }
      return isString(xs) ? listToString(ys) : ys;
    }
    ys = {};
    var ks = keys(xs);
    for (var j = 0; j < ks.length; j++) {
      ys[ks[j]] = f(xs[ks[j]], ks[j]);
    }
    return ys;
  });

  register('filter', function _filter(p, xs) {
    if (isStream(xs)) {
      return (isInfinite(xs) ? mkInfinite : mkStream)(function () {
        var x;
        while ((x = xs()) !== eos) {
          if (p(x)) {
            return x;
          }
        }
        return eos;
      });
    }
    var ys;
    if (isArray(xs) || isString(xs)) {
      ys = [];
      for (var i = 0; i < xs.length; i++) {
        if (p(xs[i])) {
          ys.push(xs[i]);
        }
      }
      return isString(xs) ? listToString(ys) : ys;
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
    if (isStream(xs)) {
      var x = xs();
      return x === eos ? undefined : x;
    }
    return xs[0];
  });

  register('last', function _last(xs) {
    if (isStream(xs)) {
      checkFinite(xs);
      var x, z;
      while ((x = xs()) !== eos) {
        z = x;
      }
      return z;
    }
    return xs[xs.length - 1];
  });

  register('tail', function _tail(xs) {
    if (isStream(xs)) {
      xs();
      return xs;
    }
    return xs.slice(1);
  });

  register('init', function _init(xs) {
    if (isStream(xs)) {
      checkFinite(xs);
      var a = xs(), b;
      return mkStream(function () {
        b = xs();
        if (b === eos) {
          return eos;
        }
        var r = a;
        a = b;
        return r;
      });
    }
    return xs.slice(0, xs.length - 1);
  });

  register('isNull', 'null_', function _null(xs) {
    if (isStream(xs)) {
      return xs() === eos;
    }
    return xs.length === 0;
  });

  register('length', function _length(xs) {
    if (isStream(xs)) {
      if (isInfinite(xs)) {
        return Infinity;
      }
      var n = 0;
      while (xs() !== eos) {
        n += 1;
      }
      return n;
    }
    return xs.length;
  });

  register('!!', 'at', 'AT', function _at(xs, ix) {
    if (isStream(xs)) {
      var x;
      for (var i = 0; i < ix; i++) {
        if (xs() === eos) {
          return x;
        }
      }
      x = xs();
      return x === eos ? undefined : x;
    }
    return xs[ix];
  });

  register('reverse', function _reverse(xs) {
    if (isStream(xs)) {
      checkFinite(xs);
      xs = Nodash.consume(xs);
      var i = xs.length - 1;
      return mkStream(function () {
        if (i < 0) {
          return eos;
        }
        return xs[i--];
      });
    }
    var zs = isString(xs) ? "".split.call(xs, '') : [].slice.call(xs);
    zs.reverse();
    return isString(xs) ? zs.join('') : zs;
  });

  register('take', function _take(n, xs) {
    if (isStream(xs)) {
      var i = 0;
      return mkStream(function () {
        if (i++ < n) {
          return xs();
        }
        return eos;
      });
    }
    return xs.slice(0, n);
  });

  register('drop', function _drop(n, xs) {
    if (isStream(xs)) {
      for (var i = 0; i < n; i++) {
        xs();
      }
      return xs;
    }
    return xs.slice(n);
  });

  register('splitAt', function _splitAt(n, xs) {
    return [ xs.slice(0, n), xs.slice(n) ];
  });

  register('takeWhile', function _takeWhile(p, xs) {
    if (isStream(xs)) {
      var exhausted = false;
      return mkStream(function () {
        var x = xs();
        if (exhausted || x == eos || !p(x)) {
          exhausted = true;
          return eos;
        }
        return x;
      });
    }
    var i = 0;
    while (i < xs.length && p(xs[i])) {
      i++;
    }
    return xs.slice(0, i);
  });

  register('dropWhile', function _dropWhile(p, xs) {
    if (isStream(xs)) {
      var x;
      while ((x = xs()) !== eos && p(x)) {
      }
      return Nodash.cons(x, xs);
    }
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
    return [ xs.slice(0, i), xs.slice(i) ];
  });

  register('break', function _break(p, xs) {
    var i = 0;
    while (i < xs.length && !p(xs[i])) {
      i++;
    }
    return [ xs.slice(0, i), xs.slice(i) ];
  });

  register('elem', function _elem(x, xs) {
    if (isStream(xs)) {
      var z;
      while ((z = xs()) !== eos) {
        if (Nodash.eq(z, x)) {
          return true;
        }
      }
      return false;
    }
    for (var i = 0; i < xs.length; i++) {
      if (Nodash.eq(xs[i], x)) {
        return true;
      }
    }
    return false;
  });

  register('notElem', function _notElem(x, xs) {
    if (isStream(xs)) {
      var z;
      while ((z = xs()) !== eos) {
        if (Nodash.eq(z, x)) {
          return false;
        }
      }
      return true;
    }
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
    var streaming = isStream(xs);
    if (streaming) {
      xs = Nodash.consume(xs);
    }
    for (var i = 0; i < xs.length; i++) {
      x = f(x, xs[i]);
    }
    if (isArray(x) && streaming) {
      return Nodash.stream(x);
    }
    return x;
  });

  register('foldl1', 'foldl1\'', function _foldl1(f, xs) {
    var streaming = isStream(xs);
    if (streaming) {
      xs = Nodash.consume(xs);
    }
    var x = xs[0];
    for (var i = 1; i < xs.length; i++) {
      x = f(x, xs[i]);
    }
    if (isArray(x) && streaming) {
      return Nodash.stream(x);
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

  register('and', Nodash.foldl(Nodash['&&'], true));

  register('or', Nodash.foldl(Nodash['||'], false));

  register('sum', Nodash.foldl(Nodash['+'], 0));

  register('product', Nodash.foldl(Nodash['*'], 1));

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
    if (isStream(xs)) {
      return Nodash.cons(x, (isInfinite(xs) ? mkInfinite : mkStream)(function () {
        var r = xs();
        if (r === eos) {
          return eos;
        }
        x = f(x, r);
        return x;
      }));
    }
    var zs = [x];
    for (var i = 0; i < xs.length; i++) {
      x = f(x, xs[i]);
      zs.push(x);
    }
    return zs;
  });

  register('scanl1', function _scanl1(f, xs) {
    if (isStream(xs)) {
      return Nodash.scanl(f, xs(), xs);
    }
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

  register('concatMap', Nodash.compose2(Nodash.concat, Nodash.map));

  register('replicate', function _replicate(n, x) {
    var xs = [];
    for (var i = 0; i < n; i++) {
      xs.push(x);
    }
    return xs;
  });

  register('zipWith', function _zipWith(f, as, bs) {
    if (isStream(as) || isStream(bs)) {
      as = Nodash.stream(as);
      bs = Nodash.stream(bs);
      return mkStream(function () {
        var a = as();
        var b = bs();
        if (a === eos || b === eos) {
          return eos;
        }
        return f(a, b);
      });
    }
    var length = Math.min(as.length, bs.length);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i]);
    }
    return zs;
  });

  register('zipWith3', function _zipWith3(f, as, bs, cs) {
    if (isStream(as) || isStream(bs) || isStream(cs)) {
      as = Nodash.stream(as);
      bs = Nodash.stream(bs);
      cs = Nodash.stream(cs);
      return mkStream(function () {
        var a = as();
        var b = bs();
        var c = cs();
        if (a === eos || b === eos || c === eos) {
          return eos;
        }
        return f(a, b, c);
      });
    }
    var length = Nodash.minimum([as.length, bs.length, cs.length]);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i], cs[i]);
    }
    return zs;
  });

  register('zipWith4', function _zipWith4(f, as, bs, cs, ds) {
    if (isStream(as) || isStream(bs) || isStream(cs) || isStream(ds)) {
      as = Nodash.stream(as);
      bs = Nodash.stream(bs);
      cs = Nodash.stream(cs);
      ds = Nodash.stream(ds);
      return mkStream(function () {
        var a = as();
        var b = bs();
        var c = cs();
        var d = ds();
        if (a === eos || b === eos || c === eos || d === eos) {
          return eos;
        }
        return f(a, b, c, d);
      });
    }
    var length = Nodash.minimum([as.length, bs.length, cs.length, ds.length]);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i], cs[i], ds[i]);
    }
    return zs;
  });

  register('zipWith5', function _zipWith5(f, as, bs, cs, ds, es) {
    var length = Nodash.minimum([
            as.length, bs.length, cs.length, ds.length, es.length]);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i], cs[i], ds[i], es[i]);
    }
    return zs;
  });

  register('zipWith6', function _zipWith6(f, as, bs, cs, ds, es, fs) {
    var length = Nodash.minimum([
            as.length, bs.length, cs.length, ds.length, es.length, fs.length]);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i], cs[i], ds[i], es[i], fs[i]);
    }
    return zs;
  });

  register('zipWith7', function _zipWith7(f, as, bs, cs, ds, es, fs, gs) {
    var length = Nodash.minimum([
            as.length, bs.length, cs.length, ds.length,
            es.length, fs.length, gs.length]);
    var zs = [];
    for (var i = 0; i < length; i++) {
      zs[i] = f(as[i], bs[i], cs[i], ds[i], es[i], fs[i], gs[i]);
    }
    return zs;
  });

  register('zip',  Nodash.zipWith(Nodash[',']));

  register('zip3', Nodash.zipWith3(Nodash[',,']));

  register('zip4', Nodash.zipWith4(Nodash[',,,']));

  register('zip5', Nodash.zipWith5(Nodash[',,,,']));

  register('zip6', Nodash.zipWith6(Nodash[',,,,,']));

  register('zip7', Nodash.zipWith7(Nodash[',,,,,,']));


  // Strings

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


  // Data.List

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
      zs = Nodash.map(listToString, zs);
    }
    return zs;
  });

//    register('subsequences', function _subsequences() {
//    });

//    register('permutations', function _permutations() {
//    });

//    register('mapAccumL', function _mapAccumL() {
//    });

//    register('mapAccumR', function _mapAccumR() {
//    });

//    register('unfoldr', function _unfoldr() {
//    });

//    register('stripPrefix', function _stripPrefix() {
//    });

//    register('nubBy', function () {
//    });

//    register('unionBy', function () {
//    });

//    register('intersectBy', function () {
//    });

  register('heads', Nodash.map(Nodash.head));

  register('lasts', Nodash.map(Nodash.lasts));

  register('inits', Nodash.map(Nodash.inits));

  register('tails', Nodash.map(Nodash.tails));

  register('isPrefixOf', function _isPrefixOf(prefix, string) {
    if (isStream(prefix)) {
      prefix = Nodash.consume(prefix);
    }
    if (isStream(string)) {
      for (var i = 0; i < prefix.length; i++) {
        if (prefix[i] !== string()) {
          return false;
        }
      }
      return true;
    }
    for (var j = 0; j < prefix.length; j++) {
      if (string[j] !== prefix[j]) {
        return false;
      }
    }
    return true;
  });

  register('isSuffixOf', function _isSuffixOf(suffix, string) {
    if (isStream(suffix)) {
      suffix = Nodash.consume(suffix);
    }
    if (isStream(string)) {
      string = Nodash.consume(string);
    }
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
      return Nodash.map(listToString, [ as, bs ]);
    }
    return [ as, bs ];
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

  register('\\\\', 'difference', function (xs, ys) {
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
    return isString(xs) ? listToString(zs) : zs;
  });

  register('union', function (xs, ys) {
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

  register('intersect', function (xs, ys) {
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

  register('sort', function (xs) {
    checkFinite(xs);
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

  register('deleteBy', function (p, x, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (p(x, xs[i])) {
        return Nodash.append(xs.slice(0,i), xs.slice(i+1));
      }
    }
    return xs;
  });

  register('delete', 'delete_', function _delete(x, xs) {
    var i = xs.indexOf(x);
    if (i >= 0) {
      return Nodash.append(xs.slice(0,i), xs.slice(i+1));
    }
    return xs;
  });

  register('insertBy', function (f, x, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (f(x, xs[i]) <= 0) {
        return Nodash.concat([xs.slice(0,i), x, xs.slice(i)]);
      }
    }
    return Nodash.append(xs, x);
  });

  register('insert', Nodash.insertBy(Nodash.compare));

  register('groupBy', function (p, xs) {
    if (xs.length === 0) {
      return [];
    }
    var zs = [];
    var current = [xs[0]];
    var last = xs[0];
    for (var i = 1; i < xs.length; i++) {
      if (p(xs[i], last)) {
        current.push(last);
      } else {
        zs.push(current);
        current = [last = xs[i]];
      }
    }
    zs.push(current);
    return isString(xs) ? Nodash.map(listToString, zs) : zs;
  });

  register('group', Nodash.groupBy(Nodash.eq));

  register('sortBy', function (fn, xs) {
    if (xs.length <= 1) {
      return xs;
    }
    var zs = isString(xs) ? "".split.call(xs, '') : [].slice.call(xs);
    zs.sort(fn);
    return isString(xs) ? zs.join('') : zs;
  });

  register('maximumBy', function (f, xs) {
    return Nodash.foldl1(function (a, b) {
      if (f(a, b) > 0) {
        return a;
      }
      return b;
    }, xs);
  });

  register('minimumBy', function (f, xs) {
    return Nodash.foldl1(function (a, b) {
      if (f(a, b) < 0) {
        return a;
      }
      return b;
    }, xs);
  });


  // Maybe

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
    if (isStream(xs)) {
      var r = xs();
      return r === eos ? null : r;
    }
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


  // Either

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

  register('Left', function _Left(value) { return { left: value }; });

  register('Right', function _Right(value) { return { right: value }; });

  register('isLeft', function _isLeft(val) {
    return val.left !== undefined || (val[0] !== undefined && val[0] !== null);
  });

  register('isRight', function _isRight(val) {
    return (val.right !== undefined || val[1] !== undefined) && !Nodash.isLeft(val);
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
    return [ Nodash.lefts(xs), Nodash.rights(xs) ];
  });


  // Objects
  
  register('keys', keys);

  return Nodash;
}

var P = install({
  install: install
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = P;
} else if (typeof define === 'function' && define.amd) {
  define(P.idf(P));
} else {
  window.Prelude = P;
  window.Nodash = P;
}

}());
