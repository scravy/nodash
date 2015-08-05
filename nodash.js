/* vim: set et sw=2 ts=2: */
(function () {

// Save a reference to `Set` (if defined). Otherwise this variable will
// be `undefined`. References to some native types (`Math`, `Array`,
// `Object`) are kept here so that native objects can be distinguished
// from local polyfills.
var NativeSet    = typeof Set !== 'undefined' && Set;
var NativeMath   = Math;
var NativeArray  = Array;
var NativeObject = Object;

function install(Nodash, Math, Array, Object, dontUseNatives, refObj, undefined) {
  "use strict";

  // Use either the supplied objects from the arguments,
  // or the references saved above.
  Math   = Math   || NativeMath;
  Array  = Array  || NativeArray;
  Object = Object || NativeObject;

  // This is the object the nodash functions will be attached to.
  // If none is given, just use a new empty object (this is the
  // object which will be returned eventually).
  Nodash = Nodash || {};

  function showEndOfStream() {
    return "end of stream";
  }

  var eos = {
    toString: showEndOfStream,
    inspect: showEndOfStream
  };

  Nodash.endOfStream = eos;

  var stream = {};

  function mkStream(f) {
    f.__stream__ = stream;
    return f;
  }

  function isStream(x)   { return isFunction(x) && x.__stream__ === stream; }


  function mkInfinite(f) {
    f = mkStream(f);
    f.__infinite__ = true;
    return f;
  }
  function isInfinite(f) {
    return !!f.__infinite__;
  }

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

  // `isObject` checks whether a thing is an object and neither an
  // array nor null.
  var isObject = function _isObject(obj) {
    if (typeof obj === 'object') {
      return obj !== null && !isArray(obj);
    }
    return false;
  };

  // Utility functions for checking basic JavaScript types.
  function isFunction(x) { return typeof x === 'function'; }
  function isString(x)   { return typeof x === 'string'; }
  function isNumber(x)   { return typeof x === 'number'; }

  // Enumerates the keys of an object. If `Object.keys` is not availabe,
  // fall back to a polyfill. The polyfill is so hilariously big to cope
  // with oddities in IE 8 (the "don't enum bug").
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

  // Either use the native set or (if `dontUseNatives` is `true` or
  // there is no native set implementation) a drop-in replacement.
  // It reproduces only the actually used functionality, which is
  // `add` and `has`. It uses the keys of an object to simulate the Set.
  var Set = (!dontUseNatives && NativeSet) || (function () {
    
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

  var trampoline = (!dontUseNatives && setImmediate) || function (f) {
    setTimeout(f, 0);
  };


  // The identity function that returns what was passed in unaltered.
  function id(x) { return x; }

  // A handy shorthand to reduce a list to a string.
  function listToString(x) { return x.join(''); }

  // `indexOf` uses an implementation of the Knuth-Morrison-Pratt
  // Algorithm for finding the index of a given subsequence
  // (identified as `word` here) within a sequence (identified as
  // `string` here). Thanks to JavaScript's dynamic nature it
  // works equally well with strings and arrays.
  function indexOf(word, string) {
    var m = 0;
    var i = 0;
    var table = [];

    var pos = 2;
    var cnd = 0;

    table[0] = -1;
    table[1] = 0;

    // build the table for KMP. This takes `O(word.length)` steps.
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
    
    // scan the string. This takes `O(string.length)` steps.
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
    // Returns -1 if the subsequence was not found in the sequence.
    return -1;
  }

  // ## Partial application
  //
  // While partial application of functions can be implemented easily
  // using JavaScript's `bind` or `apply` functions, it is more
  // efficient to use closures as JavaScript's native functions
  // additionally do some heavy error checking and deal with `this`.
  //
  // Partial application of functions relies on the `length` reported
  // by a function. A correct partial application returns a function
  // with a length
  // `length of function which is applied MINUS number of arguments consumed`.
  // Unfortunately this means we need to have some biolerplate code for
  // every arity of functions and results, thus the big blob of code
  // below.
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
    }
  };

  // Turns an ordinary function into a function which can be partially applied.
  // The maximum arity that this can deal with is 8 (see above).
  Nodash.curried = function (fn) { return funcs[fn.length](fn); };

  /* @ifdef WITH_ONLINE_HELP */
  Nodash.metadata = [];
  function description(f) {
    var text = "";
    if (isFunction(f)) {
      f();
      text = f.toString()
              .replace(/^ *function *\(\) *\{/, '')
              .replace(/\} *$/, '')
              .replace(/^ *\/\/ ?/gm, '');
    }
    return { description: text };
  }
  /* @endif */

  var currentGroup = "";

  /* @ifdef WITH_ONLINE_HELP */
  function group(name, desc) {
    currentGroup = { name: name, description: description(desc).description };
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
      /* @ifdef WITH_ONLINE_HELP */
      case 'object':
        metadata.description = arg.description;
        break;
      /* @endif */
      }
    }
    fCurried = Nodash.curried(f.composed ? f() : f);
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

  // # The actual functions
  //
  // Every function is exported by attaching it to the `Nodash` object
  // via `register`. If the function is defined immediately it is given
  // a name prefixed with an underscore, i.e.
  //
  //     register('<function-name>', function _functionName() { ... }
  //
  // to make stack traces more readable.

  
  group('Types', function () {
  // 
  });

  register('isFunction', description(function () {
  // `Any → Bool`
  }), isFunction);
  register('isStream', description(function () {
  // `Any → Bool`
  }), isStream);
  register('isArray', description(function () {
  // `Any → Bool`
  }), isArray);
  register('isNumber', description(function () {
  // `Any → Bool`
  }), isNumber);
  register('isInfinite', description(function () {
  // `Any → Bool`
  }), isInfinite);
  register('isObject', description(function () {
  // `Any → Bool`
  }), isObject);

  // ## Functions dealing with functions

  group('Functions');

  register('id', description(function () {
  // `a → a`
  }), id);

  register('idf', description(function () {
  // `a → () → a`
  }), function _idf(x) {
    return function () {
      return x;
    };
  });

  register('const', 'const_', 'constant', description(function () {
  // `a → b → a`
  // Accepts two arguments and returns the first one, thereby discarding
  // the second one. This function is primarily useful for composing other
  // functions.
  }), function _const(a, b) {
    return a;
  });

  register('$', 'apply', description(function () {
  // `(a → b) → a → b`
  }), function _apply(f, x) {
    return f(x);
  });

  register('.', 'compose', description(function () {
  // `(b → c) → (a → b) → (a → c)`
  }), function _compose(f, g, x) {
    return f(g(x));
  });

  register('compose2', description(function () {
  // `(c → d) → (a → b → c) → (a → b → d)`
  }), function _compose2(f, g, x, y) {
    return f(g(x, y));
  });

  register('flip', description(function () {
  // `Any → Bool`
  }), function _flip(f) {
    return funcs[2](function (b, a) {
      return f(a, b);
    });
  });

  // **on**
  register('on', description(function () {
  // `(b → b → c) → (a → b) → (a → a → c)`
  }), function _on(g, f, a, b) {
    return g(f(a), f(b));
  });


  // ## Functions for working with boolean functions

  group('Boolean');

  register('&&', 'AND', description(function () {
  // `Bool → Bool → Bool`
  }), function _AND(a, b) { return a && b; });

  register('||', 'OR', description(function () {
  // `Bool → Bool → Bool`
  }), function _OR(a, b) { return a || b; });

  register('not', description(function () {
  // `Bool → Bool`
  }), function _not(value) { return !value; });

  register('bool', description(function () {
  // `a → a → Bool → a`
  }), function _bool(yes, no, bool) {
    return bool ? yes : no;
  });


  // ## Tuple
  
  group('Tuples');

  register('fst', description(function () {
  // `(a, b) → a`
  }), function _fst(arr) { return arr[0]; });

  register('snd', description(function () {
  // `(a, b) → b`
  }), function _snd(arr) { return arr[1]; });

  register(',', 'tuple', description(function () {
  // `a → b → (a, b)`
  }), function _tuple(a, b) { return [ a, b ]; });

  register(',,', 'tuple3', description(function () {
  // `a → b → c → (a, b, c)`
  }), function _tuple3(a, b, c) { return [ a, b, c ]; });

  register(',,,', 'tuple4', description(function () {
  // `a → b → c → d → (a, b, c, d)`
  }), function _tuple4(a, b, c, d) { return [ a, b, c, d ]; });

  
  // Eq
  
  group("Comparisons");

  register('==', 'eq', 'EQ', description(function () {
  // `Any → Any → Bool`
  }), function _eq(a, b) {
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

  register('/=', 'neq', 'NEQ', description(function () {
  // `Any → Any → Bool`
  }), function _neq(a, b) {
    return !Nodash.eq(a, b);
  });


  // Ord

  register('compare', description(function () {
  // `a → a → Number`
  }), function _compare(a, b) {
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

  register('<', 'lt', 'LT', description(function () {
  // `a → a → Bool`
  }), function _lt(a, b) {
    return Nodash.compare(a, b) < 0;
  });

  register('>', 'gt', 'GT', description(function () {
  // `a → a → Bool`
  }), function _gt(a, b) {
    return Nodash.compare(a, b) > 0;
  });

  register('<=', 'lte', 'LTE', description(function () {
  // `a → a → Bool`
  }), function _lte(a, b) {
    return Nodash.compare(a, b) <= 0;
  });

  register('>=', 'gte', 'GTE', description(function () {
  // `a → a → Bool`
  }), function _gte(a, b) {
    return Nodash.compare(a, b) >= 0;
  });

  register('max', description(function () {
  // `Number → Number → Number`
  }), function _max(a, b) {
    if (Nodash.gt(a, b)) {
      return a;
    }
    return b;
  });

  register('min', description(function () {
  // `Number → Number → Number`
  }), function _min(a, b) {
    if (Nodash.lt(a, b)) {
      return a;
    }
    return b;
  });

  register('comparing', description(function () {
  // `(a → b) → a → a → Number`
  }), function _comparing(f, a, b) {
    return Nodash.compare(f(a), f(b));
  });


  // Data.Char

  group('Characters');
  
  register('isDigit', description(function () {
  // `Char → Bool`
  }), function _isDigit(x) {
    return !!x.match(/[0-9]/);
  });

  register('isAsciiLetter', description(function () {
  // `Char → Bool`
  }), function _isAsciiLetter(x) {
    return !!x.match(/[a-zA-Z]/);
  });


  // Num

  group('Numbers');

  register('+', 'add', 'ADD', 'plus', 'PLUS', description(function () {
  // `Number → Number → Number`
  }), function _add(a, b) {
    return a + b;
  });

  register('-', 'sub', 'minus', 'MINUS', 'subtract', description(function () {
  // `Number → Number → Number`
  }), function _sub(a, b) {
    return a - b;
  });

  register('*', 'mul', 'MUL', 'times', 'TIMES', description(function () {
  // `Number → Number → Number`
  }), function _mul(a, b) {
    return a * b;
  });

  register('abs', description(function () {
  // `Number → Number`
  }), Math.abs);

  register('negate', description(function () {
  // `Number → Number`
  }), function _negate(a) { return -a; });

  register('signum', description(function () {
  // `Number → Number`
  }), function _signum(x) {
    if (x > 0) {
      return 1;
    } else if (x === 0) {
      return 0;
    }
    return -1;
  });


  // Integral

  register('div', description(function () {
  // `Number → Number → Number`
  }), function _div(a, b) { return Math.floor(a / b); });

  register('quot', description(function () {
  // `Number → Number → Number`
  }), function _quot(a, b) {
    var r = a / b;
    return r >= 0 ? Math.floor(r) : Math.ceil(r);
  });

  register('rem', description(function () {
  // `Number → Number → Number`
  }), function _rem(a, b) { return a % b; });

  register('mod', description(function () {
  // `Number → Number → Number`
  }), function _mod(a, b) {
    var q = Nodash.quot(a, b);
    var r = Nodash.rem(a, b);
    return Nodash.signum(r) == -Nodash.signum(b) ? r + b : r;
  });

  register('divMod', description(function () {
  // `Number → Number → (Number, Number)`
  }), function _divMod(a, b)  {
    return [Nodash.div(a, b), Nodash.mod(a, b)];
  });

  register('quotRem', description(function () {
  // `Number → Number → (Number, Number)`
  }), function _quotRem(a, b) {
    return [Nodash.quot(a, b), Nodash.rem(a, b)];
  });


  // Fractional

  register('/', 'frac', description(function () {
  // `Number → Number → Number`
  }), function _frac(a, b) { return a / b; });

  register('recip', description(function () {
  // `Number → Number`
  }), function _recip(a) { return 1 / a; });


  // Floating

  register('exp', description(function () {
  // `Number → Number`
  }), Math.exp);

  register('sqrt', description(function () {
  // `Number → Number`
  }), Math.sqrt);

  register('log', description(function () {
  // `Number → Number`
  }), Math.log);

  register('logBase', description(function () {
  // `Number → Number → Number`
  }), function _logBase(a, b) {
    return Math.log(a) / Math.log(b);
  });

  register('**', 'pow', '^', '^^', description(function () {
  // `Number → Number → Number`
  }), Math.pow);

  register('sin', description(function () {
  // `Number → Number`
  }), Math.sin);

  register('tan', description(function () {
  // `Number → Number`
  }), Math.tan);

  register('cos', description(function () {
  // `Number → Number`
  }), Math.cos);

  register('asin', description(function () {
  // `Number → Number`
  }), Math.asin);

  register('atan', description(function () {
  // `Number → Number`
  }), Math.atan);

  register('acos', description(function () {
  // `Number → Number`
  }), Math.acos);

  register('sinh', description(function () {
  // `Number → Number`
  }), Math.sinh || function _sinh(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
  });

  register('tanh', description(function () {
  // `Number → Number`
  }), Math.tanh || function _tanh(x) {
    if (x === Infinity) {
      return 1;
    } else if (x === -Infinity) {
      return -1;
    } else {
      return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
    }
  });

  register('cosh', description(function () {
  // `Number → Number`
  }), Math.cosh || function _cosh(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
  });

  register('asinh', description(function () {
  // `Number → Number`
  }), Math.asinh || function _asinh(x) {
    if (x === -Infinity) {
      return x;
    } else {
      return Math.log(x + Math.sqrt(x * x + 1));
    }
  });

  register('atanh', description(function () {
  // `Number → Number`
  }), Math.atanh || function _atanh(x) {
    return Math.log((1 + x) / (1 - x)) / 2;
  });

  register('acosh', description(function () {
  // `Number → Number`
  }), Math.acosh || function _acosh(x) {
    return Math.log(x + Math.sqrt(x * x - 1));
  });


  // RealFrac

  register('properFraction', description(function () {
  // `Number → (Number, Number)`
  }), function _properFraction(x) {
    var num = Nodash.truncate(x);
    return [ num, -(num - x) ];
  });

  register('truncate', description(function () {
  // `Number → Number`
  }), Math.trunc || function _truncate(x) {
    switch (Nodash.signum(x)) {
    case -1:
      return Math.ceil(x);
    case 1:
      return Math.floor(x);
    }
    return 0;
  });

  register('round', description(function () {
  // `Number → Number → Number`
  // Haskell's round and JavaScripts Math.round are different
  }), function _round(x) {
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

  register('ceiling', description(function () {
  // `Number → Number`
  }), Math.ceil);

  register('floor', description(function () {
  // `Number → Number`
  }), Math.floor);


  // RealFloat

  /* ... */


  // Numeric

  register('gcd', description(function () {
  // `Number → Number → Number`
  // Greatest common divisor.
  }), function _gcd(a, b) {
    var c;
    while (b !== 0) {
      c = Nodash.rem(a, b);
      a = b;
      b = c;
    }
    return a;
  });

  register('lcm', description(function () {
  // `Number → Number → Number`
  // Lowest common denominator.
  }), function _lcm(a, b) {
    if (a === 0 || b === 0) {
      return 0;
    }
    return Math.abs(Nodash.quot(a, Nodash.gcd(a, b)) * b);
  });

  register('even', description(function () {
  // `Number → Bool`
  }), function _even(x) { return (x % 2) === 0; });

  register('odd', description(function () {
  // `Number → Bool`
  }), function _odd(x) { return (x % 2) !== 0; });


  group('Control flow');

  register('until', description(function () {
  // `(a → Bool) → (a → a) → a → a`
  }), function _until(p, f, v) {
    while (!p(v)) {
      v = f(v);
    }
    return v;
  });

  register('pipe', description(function () {
  // Pipes.
  }), function _pipe() {
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


  group('Streams');

  register('stream', 'lazy', description(function () {
  // `[a] → [a]`
  }), function _stream(xs) {
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

  register('consume', description(function () {
  // `[a] → [a]`
  }), function _consume(xs) {
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

  register('consumeString', description(function () {
  // `[a] → String`
  }), function _consumeString(xs) {
    if (!isStream(xs)) {
      return "" + xs;
    }
    var z, zs = "";
    while ((z = xs()) !== eos) {
      zs += z;
    }
    return zs;
  });

  register('each', description(function () {
  // `(a → ()) → [a] → ()`
  }), function _each(f, xs) {
    if (isStream(xs)) {
      var x;
      while ((x = xs()) !== eos) {
        f(x);
      }
    } else if (isArray(xs) || isString(xs)) {
      for (var i = 0; i < xs.length; i++) {
        f(xs[i], i);
      }
    } else {
      var ks = keys(xs);
      for (var j = 0; j < ks.length; j += 1) {
        f(xs[ks[j]], ks[j]);
      }
    }
  });

  register('cycle', description(function () {
  // `[a] → [a]`
  }), function _cycle(xs) {
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

  register('repeat', description(function () {
  // `a → [a]`
  }), function _repeat(x) {
    return mkInfinite(function () {
      return x;
    });
  });

  register('iterate', description(function () {
  // `(a → a) → a → [a]`
  }), function _iterate(f, x) {
    return mkInfinite(function () {
      var r = x;
      x = f(x);
      return r;
    });
  });


  group('Strings');

  register('lines', description(function () {
  // `String → [String]`
  }), function _lines(string) {
    var result = string.split(/\n/);
    if (result[result.length - 1].length === 0) {
      delete result[result.length - 1];
    }
    return result;
  });

  register('unlines', description(function () {
  // `[String] → String`
  }), function _unlines(lines) {
    return lines.join('\n');
  });

  register('words', description(function () {
  // `String → [String]`
  }), function _words(string) {
    return string.split(/[\n\r\v\t ]/);
  });

  register('unwords', description(function () {
  // `[String] → String`
  }), function _unwords(words) {
    return words.join(' ');
  });


  group('Arrays / Lists');

  register(':', 'cons', description(function () {
  // `a → [a] → [a]`
  }), function _cons(x, xs) {
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

  register('++', 'append', description(function () {
  // `[a] → [a] → [a]`
  }), function _append(xs, ys) {
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

  register('map', description(function () {
  // `(a → b) → [a] → [b]`
  }), function _map(f, xs) {
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

  register('filter', description(function () {
  // `(a → Bool) → [a] → [a]`
  }), function _filter(p, xs) {
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

  register('head', description(function () {
  // `[a] → a`
  }), function _head(xs) {
    if (isStream(xs)) {
      var x = xs();
      return x === eos ? undefined : x;
    }
    return xs[0];
  });

  register('last', description(function () {
  // `a → [a]`
  }), function _last(xs) {
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

  register('tail', description(function () {
  // `[a] → [a]`
  }), function _tail(xs) {
    if (isStream(xs)) {
      xs();
      return xs;
    }
    if (isString(xs)) {
      return xs.slice(1);
    }
    return Array.prototype.slice.call(xs, 1);
  });

  register('init', description(function () {
  // `[a] → [a]`
  }), function _init(xs) {
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
    if (isString(xs)) {
      return xs.slice(0, xs.length - 1);
    }
    return Array.prototype.slice.call(xs, 0, xs.length - 1);
  });

  register('isNull', 'null_', 'isEmpty', description(function () {
  // `[a] → Bool`
  }), function _null(xs) {
    if (isStream(xs)) {
      return xs() === eos;
    }
    if (isObject(xs)) {
      for (var _ in xs) {
        return false;
      }
      return true;
    }
    return xs.length === 0;
  });

  register('length', description(function () {
  // `[a] → Number`
  }), function _length(xs) {
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
    if (isObject(xs)) {
      return keys(xs).length;
    }
    return xs.length;
  });

  register('select', description(function () {
  // `String → Object → Unknown`
  }), function _select(path, object) {
    return Nodash.foldl(Nodash.at, object, path.split(/\./));
  });

  register('!!', 'at', 'AT', description(function () {
  // `[a] → Number → a`
  }), function _at(xs, ix) {
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

  register('reverse', description(function () {
  // `[a] → [a]`
  }), function _reverse(xs) {
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

  register('take', description(function () {
  // `Number → [a] → [a]`
  }), function _take(n, xs) {
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

  register('drop', description(function () {
  // `Number → [a] → [a]`
  }), function _drop(n, xs) {
    if (isStream(xs)) {
      for (var i = 0; i < n; i++) {
        xs();
      }
      return xs;
    }
    return xs.slice(n);
  });

  register('splitAt', description(function () {
  // `→`
  }), function _splitAt(n, xs) {
    return [ xs.slice(0, n), xs.slice(n) ];
  });

  register('takeWhile', description(function () {
  // `→`
  }), function _takeWhile(p, xs) {
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

  register('dropWhile', description(function () {
  // `→`
  }), function _dropWhile(p, xs) {
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

  register('span', description(function () {
  // `→`
  }), function _span(p, xs) {
    var i = 0;
    while (i < xs.length && p(xs[i])) {
        i++;
    }
    return [ xs.slice(0, i), xs.slice(i) ];
  });

  register('break_', 'break', description(function () {
  // `→`
  }), function _break(p, xs) {
    var i = 0;
    while (i < xs.length && !p(xs[i])) {
      i++;
    }
    return [ xs.slice(0, i), xs.slice(i) ];
  });

  register('elem', description(function () {
  // `→`
  }), function _elem(x, xs) {
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

  register('notElem', description(function () {
  // `→`
  }), function _notElem(x, xs) {
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

  register('lookup', description(function () {
  // `→`
  }), function _lookup(x, xs) {
    if (isArray(xs)) {
      for (var i = 0; i < xs.length; i++) {
        if (xs[i] && Nodash.eq(xs[i][0], x)) {
          return xs[i][1];
        }
      }
    }
    return xs[x];
  });

  register('foldl', 'foldl\'', description(function () {
  // `→`
  }), function _foldl(f, x, xs) {
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

  register('foldl1', 'foldl1\'', description(function () {
  // `→`
  }), function _foldl1(f, xs) {
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

  register('foldr', description(function () {
  // `→`
  }), function _foldr(f, x, xs) {
    for (var i = xs.length - 1; i >= 0; i--) {
      x = f(xs[i], x);
    }
    return x;
  });

  register('foldr1', description(function () {
  // `→`
  }), function _foldr1(f, xs) {
    var x = xs[xs.length - 1];
    for (var i = xs.length - 2; i >= 0; i--) {
      x = f(xs[i], x);
    }
    return x;
  });

  register('and', description(function () {
  // `→`
  }), composed(function (){return Nodash.foldl(Nodash.AND, true);}));

  register('or', description(function () {
  // `→`
  }), composed(function (){return Nodash.foldl(Nodash.OR, false);}));

  register('sum', description(function () {
  // `→`
  }), composed(function (){return Nodash.foldl(Nodash.ADD, 0);}));

  register('product', description(function () {
  // `→`
  }), composed(function (){return Nodash.foldl(Nodash.MUL, 1);}));

  register('maximum', description(function () {
  // `→`
  }), composed(function (){return Nodash.foldl(Nodash.max, -Infinity);}));

  register('minimum', description(function () {
  // `→`
  }), composed(function (){return Nodash.foldl(Nodash.min, +Infinity);}));

  register('any', description(function () {
  // `→`
  }), function _any(p, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (p(xs[i])) {
        return true;
      }
    }
    return false;
  });

  register('all', description(function () {
  // `→`
  }), function _all(p, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (!p(xs[i])) {
        return false;
      }
    }
    return true;
  });

  register('scanl', description(function () {
  // `→`
  }), function _scanl(f, x, xs) {
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

  register('scanl1', description(function () {
  // `→`
  }), function _scanl1(f, xs) {
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

  register('scanr', description(function () {
  // `→`
  }), function _scanr(f, x, xs) {
    var zs = [x];
    for (var i = xs.length - 1; i >= 0; i--) {
      x = f(xs[i], x);
      zs.unshift(x);
    }
    return zs;
  });

  register('scanr1', description(function () {
  // `→`
  }), function _scanr1(f, xs) {
    var x = xs[xs.length - 1];
    var zs = [x];
    for (var i = xs.length - 2; i >= 0; i--) {
      x = f(xs[i], x);
      zs.unshift(x);
    }
    return zs;
  });

  register('concat', description(function () {
  // `→`
  }), function _concat(xs) {
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

  register('concatMap', description(function () {
  // `→`
  }), composed(function (){return Nodash.compose2(Nodash.concat, Nodash.map);}));

  register('replicate', description(function () {
  // `→`
  }), function _replicate(n, x) {
    var xs = [];
    for (var i = 0; i < n; i++) {
      xs.push(x);
    }
    return xs;
  });

  register('zipWith', description(function () {
  // `→`
  }), function _zipWith(f, as, bs) {
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

  register('zipWith3', description(function () {
  // `→`
  }), function _zipWith3(f, as, bs, cs) {
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

  register('zipWith4', description(function () {
  // `→`
  }), function _zipWith4(f, as, bs, cs, ds) {
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

  register('zip', description(function () {
  // `[a] → [b] → ([a], [b])`
  }), composed(function (){return Nodash.zipWith(Nodash.tuple);}));

  register('zip3', description(function () {
  // `[a] → [b] → [c] → ([a], [b], [c])`
  }), composed(function (){return Nodash.zipWith3(Nodash.tuple3);}));

  register('zip4', description(function () {
  // `[a] → [b] → [c] → [d] → ([a], [b], [c], [d])`
  }), composed(function (){return Nodash.zipWith4(Nodash.tuple4);}));

  
  // further from Data.List

  register('intersperse', description(function () {
  // `a → [a] → [a]`
  }), function _intersperse(x, xs) {
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

  register('intercalate', description(function () {
  // `[a] → [a] → [a]`
  }), function _intercalate(x, xs) {
    return Nodash.concat(Nodash.intersperse(x, xs));
  });

  register('transpose', description(function () {
  // `[[a]] → [[a]]`
  }), function _transpose(xss) {
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

  register('heads', description(function () {
  // `[[a]] → [a]`
  }), composed(function (){return Nodash.map(Nodash.head);}));

  register('lasts', description(function () {
  // `[[a]] → [a]`
  }), composed(function (){return Nodash.map(Nodash.lasts);}));

  register('inits', description(function () {
  // `[[a]] → [[a]]`
  }), composed(function (){return Nodash.map(Nodash.inits);}));

  register('tails', description(function () {
  // `[[a]] → [[a]]`
  }), composed(function (){return Nodash.map(Nodash.tails);}));

  register('isPrefixOf', description(function () {
  // `[a] → [a] → Bool`
  }), function _isPrefixOf(prefix, string) {
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

  register('isSuffixOf', description(function () {
  // `[a] → [a] → Bool`
  }), function _isSuffixOf(suffix, string) {
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

  register('isInfixOf', description(function () {
  // `[a] → [a] → Bool`
  }), function _isInfixOf(infix, string) {
      return indexOf(infix, string) >= 0;
  });

  register('indexOf', indexOf);

  register('find', description(function () {
  // `→`
  }), function _find(p, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (p(xs[i])) {
        return xs[i];
      }
    }
    return null;
  });

  register('partition', description(function () {
  // `→`
  }), function _partition(p, xs) {
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

  register('findIndex', description(function () {
  // `→`
  }), function _elemIndex(p, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (p(xs[i])) {
        return i;
      }
    }
    return null;
  });

  register('findIndices', description(function () {
  // `→`
  }), function _elemIndex(p, xs) {
    var zs = [];
    for (var i = 0; i < xs.length; i++) {
      if (p(xs[i])) {
        zs.push(i);
      }
    }
    return zs;
  });
  
  register('elemIndex', description(function () {
  // `→`
  }), function _elemIndex(x, xs) {
    return Nodash.findIndex(Nodash.eq(x), xs);
  });

  register('elemIndices', description(function () {
  // `→`
  }), function _elemIndex(x, xs) {
    return Nodash.findIndices(Nodash.eq(x), xs);
  });

  register('nub', description(function () {
  // `[a] → [a]`
  }), function _nub(xs) {
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

  register('\\\\', 'difference', description(function () {
  // `[a] → [a] → [a]`
  }), function _difference(xs, ys) {
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

  register('union', description(function () {
  // `[a] → [a] → [a]`
  }), function _union(xs, ys) {
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

  register('intersect', description(function () {
  // `[a] → [a] → [a]`
  }), function _intersect(xs, ys) {
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

  register('sort', description(function () {
  // `[a] → [a]`
  }), function _sort(xs) {
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

  register('deleteBy', description(function () {
  // `→`
  }), function _deleteBy(p, x, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (p(x, xs[i])) {
        return Nodash.append(xs.slice(0,i), xs.slice(i+1));
      }
    }
    return xs;
  });

  register('delete_', 'delete', description(function () {
  // `→`
  }), function _delete(x, xs) {
    var i = xs.indexOf(x);
    if (i >= 0) {
      return Nodash.append(xs.slice(0,i), xs.slice(i+1));
    }
    return xs;
  });

  register('insertBy', description(function () {
  // `→`
  }), function _insertBy(f, x, xs) {
    for (var i = 0; i < xs.length; i++) {
      if (f(x, xs[i]) <= 0) {
        return Nodash.concat([xs.slice(0,i), x, xs.slice(i)]);
      }
    }
    return Nodash.append(xs, x);
  });

  register('insert', description(function () {
  // `→`
  }), composed(function (){return Nodash.insertBy(Nodash.compare);}));

  register('groupBy', description(function () {
  // `→`
  }), function _groupBy(p, xs) {
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
    return isString(xs) ? Nodash.map(listToString, zs) : zs;
  });

  register('group', description(function () {
  // `→`
  }), composed(function (){return Nodash.groupBy(Nodash.eq);}));

  register('sortBy', description(function () {
  // `→`
  }), function _sortBy(fn, xs) {
    if (isStream(xs)) {
      checkFinite(xs);
      xs = Nodash.consume(xs);
    }
    if (xs.length <= 1) {
      return xs;
    }
    var yesItsAString = isString(xs);
    var zs = yesItsAString ? "".split.call(xs, '') : [].slice.call(xs);
    zs.sort(fn);
    return yesItsAString ? zs.join('') : zs;
  });

  register('maximumBy', description(function () {
  // `→`
  }), function _maximumBy(f, xs) {
    return Nodash.foldl1(function (a, b) {
      if (f(a, b) > 0) {
        return a;
      }
      return b;
    }, xs);
  });

  register('minimumBy', description(function () {
  // `→`
  }), function _minimumBy(f, xs) {
    return Nodash.foldl1(function (a, b) {
      if (f(a, b) < 0) {
        return a;
      }
      return b;
    }, xs);
  });


  // ## Maybe

  group('Maybe');

  register('maybe', description(function () {
  // `b → (a → b) Maybe a → b`
  }), function _maybe(def, fun, maybe) {
    if (maybe === undefined || maybe === null) {
      return def;
    }
    return fun(maybe);
  });

  register('isJust', description(function () {
  // `Maybe a → Bool`
  }), function _isJust(value) {
    return value !== undefined && value !== null;
  });

  register('isNothing', description(function () {
  // `Maybe a → Bool`
  }), function _isNothing(value) {
    return value === undefined || value === null;
  });

  register('fromMaybe', description(function () {
  // `a → Maybe a → a`
  }), function _fromMaybe(def, maybe) {
    if (maybe === undefined || maybe === null) {
      return def;
    }
    return maybe;
  });

  register('listToMaybe', description(function () {
  // `→`
  }), function _listToMaybe(xs) {
    if (isStream(xs)) {
      var r = xs();
      return r === eos ? null : r;
    }
    return xs[0];
  });

  register('maybeToList', description(function () {
  // `→`
  }), function _maybeToList(maybe) {
    if (maybe === undefined || maybe === null) {
      return [];
    }
    return [maybe];
  });

  register('catMaybes', description(function () {
  // `→`
  }), composed(function (){return Nodash.filter(Nodash.isJust);}));

  register('mapMaybe', description(function () {
  // `→`
  }), composed(function (){return Nodash.compose2(Nodash.filter(Nodash.isJust), Nodash.map);}));


  // ## Either

  group('Either');

  register('either', description(function () {
  // `(a → c) → (b → c) → Either a b → c`
  }), function _either(afun, bfun, either) {
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

  register('Left', description(function () {
  // `a → Either a b`
  }), function _Left(value) {
    return { left: value };
  });

  register('Right', description(function () {
  // `b → Either a b`
  }), function _Right(value) {
    return { right: value };
  });

  register('isLeft', description(function () {
  // `Either a b → Bool`
  }), function _isLeft(val) {
    return val.left !== undefined ||
      (val[0] !== undefined && val[0] !== null);
  });

  register('isRight', description(function () {
  // `Either a b → Bool`
  }), function _isRight(val) {
    return (val.right !== undefined || val[1] !== undefined) &&
      !Nodash.isLeft(val);
  });

  register('fromLeft', description(function () {
  // `Either a b → a`
  }), function _fromLeft(val) {
    if (val.left !== undefined) {
      return val.left;
    }
    return val[0];
  });

  register('fromRight', description(function () {
  // `Either a b → b`
  }), function _fromRight(val) {
    if (val.right !== undefined) {
      return val.right;
    }
    return val[1];
  });

  register('lefts', description(function () {
  // `[Either a b] → [a]`
  }), Nodash.compose(
              Nodash.map(Nodash.fromLeft),
              Nodash.filter(Nodash.isLeft)
  ));

  register('rights', description(function () {
  // `[Either a b] → [b]`
  }), Nodash.compose(
              Nodash.map(Nodash.fromRight),
              Nodash.filter(Nodash.isRight)
  ));

  register('partitionEithers', description(function () {
  // `[Either a b] → ([a], [b])`
  }), function _partitionEithers(xs) {
    return [ Nodash.lefts(xs), Nodash.rights(xs) ];
  });


  // ## Objects
  
  group('Objects');

  register('keys', description(function () {
  // `Object → [String]`
  }), keys);

  register('clone', description(function () {
  // `Any → Any`
  }), function _clone(thing) {
    if (typeof thing === 'object') {
      if (thing === null) {
        return null;
      }
      var result = isArray(thing) ? [] : {};
      Nodash.each(function (value, key) {
        result[key] = Nodash.clone(value);
      }, thing);
      return result;
    }
    return thing;
  });


  // ## Tasks

  group('Tasks');

  register('async', description(function () {
  // 
  }), function _async(f) {
    return function () {
      try {
        var callback = last(arguments);
        var result = f.apply(null, init(arguments));
        trampoline(function () { callback(result); });
      } catch (e) {
        trampoline(function () { callback(null, e); });
      }
    };
  });

  register('run', description(function () {
  // `TaskSpec → (Result → ()) → ()`
  }), function _run(specification) {
    // this function does its own currying.
    if (arguments.length == 2) {
      Nodash.run(specification)(arguments[1]);
      return;
    }

    var tasks = {};

    // prepare tasks specification.
    Nodash.each(function (spec, name) {
      var dependencies = [];
      var func = null;
      if (isArray(spec)) {
        dependencies = Nodash.init(spec);
        func = Nodash.last(spec);
      } else if (isFunction(spec)) {
        func = spec;
      }

      var task = {
        func: func,
        args: dependencies,
        depends: {},
        enables: tasks[name] ? tasks[name].enables : {}
      };
      Nodash.each(function (dependency) {
        task.depends[dependency] = true;
        if (!tasks[dependency]) {
            tasks[dependency] = { enables: {} };
        }
        tasks[dependency].enables[name] = true;
      }, dependencies);
      tasks[name] = task;
    }, specification);

    return function _runTasks(callback) {

      var depends = {},
          initial = [],
          results = {},
          toGo = Nodash.length(tasks);

      function callbackHandle(task) {
        return function (result, error) {
          results[task] = {};
          if (!error) {
            results[task].result = result;
          } else {
            results[task].error = error;
          }
          toGo -= 1;
          if (toGo === 0) {
            callback(results);
          } else {
            Nodash.each(function (_, next) {
              delete depends[next][task];
              if (isEmpty(depends[next])) {
                schedule(next);
              }
            }, tasks[task].enables);
          }
        };
      }

      function schedule(taskName) {
        var task = tasks[taskName];
        trampoline(function _executeTask() {
          var f = callbackHandle(taskName);
          var dependenciesFailed = false;
          var args = Nodash.map(function (dependency) {
            if (results[dependency].error) {
              dependenciesFailed = true;
            }
            return results[dependency].result;
          }, task.args);
          if (dependenciesFailed) {
            trampoline(function () { f(null, "dependencies failed"); });
          } else {
            args.push(f);
            try {
              task.func.apply(null, args);
            } catch (e) {
              trampoline(function () { f(null, e); });
            }
          }
        });
      }

      Nodash.each(function (task, taskName) {
        depends[taskName] = Nodash.clone(task.depends) || {};

        if (Nodash.isNull(depends[taskName])) {
          schedule(taskName);
        }
      }, tasks);
    };
  });


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
