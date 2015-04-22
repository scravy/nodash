(function () {

var NativeSet    = typeof Set !== 'undefined' && Set;
var NativeMath   = Math;
var NativeArray  = Array;
var NativeObject = Object;

function install(Prelude, Math, Array, Object, dontUseNativeSet) {
    "use strict";

    Math    = Math    || NativeMath;
    Array   = Array   || NativeArray;
    Object  = Object  || NativeObject;
    Prelude = Prelude || {};

    var eos = {};
    var stream = {};

    Prelude.endOfStream = eos;

    function mkStream(f) {
        f.__stream__ = stream;
        return f;
    }

    var isArray = Array.isArray || function _isArray(arr) {
        return NativeObject.prototype.toString.call(arr) === '[object Array]';
    };

    function isFunction(x) { return typeof x === 'function'; }
    function isString(x)   { return typeof x === 'string'; }
    function isNumber(x)   { return typeof x === 'number'; }
    function isStream(x)   { return isFunction(x) && x.__stream__ === stream; }

    var keys = Object.keys || (function() {
        var hasOwnProperty = NativeObject.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
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

    Prelude.curried = function (fn) { return funcs[fn.length](fn); };

    Prelude.functions = {};

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
                f = Prelude.curried(arg);
                break;
            }
        }
        for (i = 0; i < aliases.length; i++) {
            Prelude[aliases[i]] = f;
        }
        aliases.shift();
        Prelude.functions[name] = {
            aliases: aliases,
            arity: f.length
        };
        return f;
    }

    // Function

    register('id', id);

    register('idf', function _idf(x) {
        return function () {
            return x;
        };
    });

    register('const', 'const_', 'constant', function _const(a, b) { return a; });

    register('$', 'apply', function _apply(f, x) { return f(x); });

    register('.', 'compose', function _compose(f, g, x) { return f(g(x)); });

    register('compose2', function _compose2(f, g, x, y) { return f(g(x, y)); });

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

    register('bool', function _bool(yes, no, bool) { return bool ? yes : no; });


    // Tuple

    register('fst', function _fst(arr) { return arr[0]; });

    register('snd', function _snd(arr) { return arr[1]; });

    register(',', function (a, b) { return [ a, b ]; });

    register(',,', function (a, b, c) { return [ a, b, c ]; });

    register(',,,', function (a, b, c, d) { return [ a, b, c, d ]; });

    register(',,,,', function (a, b, c, d, e) { return [ a, b, c, d, e ]; });

    register(',,,,,', function (a, b, c, d, e, f) { return [ a, b, c, d, e, f ]; });

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
            var k = Prelude.union(keys(a), keys(b));
            for (var i = 0; i < k.length; i++) {
                if (!Prelude.eq(a[k[i]], b[k[i]])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    });

    register( '/=', 'neq', 'NEQ',function _neq(a, b) {
        return !Prelude.eq(a, b);
    });


    // Ord

    register('<', 'lt', 'LT', function _lt(a, b) {
        return Prelude.compare(a, b) < 0;
    });

    register('>', 'gt', 'GT', function _gt(a, b) {
        return Prelude.compare(a, b) > 0;
    });

    register('<=', 'lte', 'LTE', function _lte(a, b) {
        return Prelude.compare(a, b) <= 0;
    });

    register('>=', 'gte', 'GTE', function _gte(a, b) {
        return Prelude.compare(a, b) >= 0;
    });

    register('max', function _max(a, b) {
        if (a > b) {
            return a;
        }
        return b;
    });

    register('min', function _min(a, b) {
        if (a < b) {
            return a;
        }
        return b;
    });

    register('compare', function _compare(a, b) {
        switch (typeof a) {
        case 'string':
            return a.localeCompare(b);
        case 'object':
            if (isFunction(a.compareTo)) {
                return a.compareTo(b);
            } else if (isArray(a)) {
                for (var i = 0; i < Math.min(a.length, b.length); i++) {
                    var r = Prelude.compare(a[i], b[i]);
                    if (r !== 0) {
                        return r;
                    }
                }
                return 0;
            }
            return a.toString().localeCompare(b.toString());
        case 'number':
            return Prelude.signum(a - b);
        }
        return undefined;
    });

    register('comparing', function _comparing(f, a, b) {
        return Prelude.compare(f(a), f(b));
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
        var q = Prelude.quot(a, b);
        var r = Prelude.rem(a, b);
        return Prelude.signum(r) == -Prelude.signum(b) ? r + b : r;
    });

    register('divMod',  function _divMod(a, b)  {
        return [Prelude.div(a, b), Prelude.mod(a, b)];
    });

    register('quotRem', function _quotRem(a, b) {
        return [Prelude.quot(a, b), Prelude.rem(a, b)];
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
        var num = Prelude.truncate(x);
        return [ num, -(num - x) ];
    });

    register('truncate', Math.trunc || function _truncate(x) {
        switch (Prelude.signum(x)) {
        case -1:
            return Math.ceil(x);
        case 1:
            return Math.floor(x);
        }
        return 0;
    });

    register('round', function _round(x) {
        // Haskell's round and JavaScripts Math.round are different
        var fraction = Prelude.properFraction(x);
        var n = fraction[0];
        var m = fraction[1] < 0 ? n - 1 : n + 1;
        switch (Prelude.signum(Math.abs(fraction[1]) - 0.5)) {
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
            c = Prelude.rem(a, b);
            a = b;
            b = c;
        }
        return a;
    });

    register('lcm', function _lcm(a, b) {
        if (a === 0 || b === 0) {
            return 0;
        }
        return Math.abs(Prelude.quot(a, Prelude.    gcd(a, b)) * b);
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


    // List

    register(':', 'cons', function _cons(x, xs) {
        if (isStream(xs)) {
            var consumedFirst = false;
            return mkStream(function () {
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
            xs = Prelude.stream(xs);
            ys = Prelude.stream(ys);
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
            return mkStream(function () {
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
            return mkStream(function () {
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
            var n = 0;
            while (xs() !== eos) {
                n += 1;
            }
            return n;
        }
        return xs.length;
    });

    register('!!', 'at', 'AT', function _at(xs, ix) { return xs[ix]; });

    register('reverse', function _reverse(xs) {
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
        for (var i = 0; i < xs.length; i++) {
            if (Prelude.eq(xs[i], x)) {
                return true;
            }
        }
        return false;
    });

    register('notElem', function _notElem(x, xs) {
        for (var i = 0; i < xs.length; i++) {
            if (Prelude.eq(xs[i], x)) {
                return false;
            }
        }
        return true;
    });

    register('lookup', function _lookup(x, xs) {
        if (isArray(xs)) {
            for (var i = 0; i < xs.length; i++) {
                if (xs[i] && Prelude.eq(xs[i][0], x)) {
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

    register('and', Prelude.foldl(Prelude['&&'], true));

    register('or', Prelude.foldl(Prelude['||'], false));

    register('sum', Prelude.foldl(Prelude['+'], 0));

    register('product', Prelude.foldl(Prelude['*'], 1));

    register('maximum', Prelude.foldl(Prelude.max, -Infinity));

    register('minimum', Prelude.foldl(Prelude.min, +Infinity));

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

    register('concatMap', Prelude.compose2(Prelude.concat, Prelude.map));

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
        var length = Prelude.minimum([as.length, bs.length, cs.length]);
        var zs = [];
        for (var i = 0; i < length; i++) {
            zs[i] = f(as[i], bs[i], cs[i]);
        }
        return zs;
    });

    register('zipWith4', function _zipWith4(f, as, bs, cs, ds) {
        var length = Prelude.minimum([as.length, bs.length, cs.length, ds.length]);
        var zs = [];
        for (var i = 0; i < length; i++) {
            zs[i] = f(as[i], bs[i], cs[i], ds[i]);
        }
        return zs;
    });

    register('zipWith5', function _zipWith5(f, as, bs, cs, ds, es) {
        var length = Prelude.minimum([
                as.length, bs.length, cs.length, ds.length, es.length]);
        var zs = [];
        for (var i = 0; i < length; i++) {
            zs[i] = f(as[i], bs[i], cs[i], ds[i], es[i]);
        }
        return zs;
    });

    register('zipWith6', function _zipWith6(f, as, bs, cs, ds, es, fs) {
        var length = Prelude.minimum([
                as.length, bs.length, cs.length, ds.length, es.length, fs.length]);
        var zs = [];
        for (var i = 0; i < length; i++) {
            zs[i] = f(as[i], bs[i], cs[i], ds[i], es[i], fs[i]);
        }
        return zs;
    });

    register('zipWith7', function _zipWith7(f, as, bs, cs, ds, es, fs, gs) {
        var length = Prelude.minimum([
                as.length, bs.length, cs.length, ds.length,
                es.length, fs.length, gs.length]);
        var zs = [];
        for (var i = 0; i < length; i++) {
            zs[i] = f(as[i], bs[i], cs[i], ds[i], es[i], fs[i], gs[i]);
        }
        return zs;
    });

    register('zip',  Prelude.zipWith(Prelude[',']));

    register('zip3', Prelude.zipWith3(Prelude[',,']));

    register('zip4', Prelude.zipWith4(Prelude[',,,']));

    register('zip5', Prelude.zipWith5(Prelude[',,,,']));

    register('zip6', Prelude.zipWith6(Prelude[',,,,,']));

    register('zip7', Prelude.zipWith7(Prelude[',,,,,,']));


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
        return Prelude.concat(Prelude.intersperse(x, xs));
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
            zs = Prelude.map(listToString, zs);
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

    register('heads', Prelude.map(Prelude.head));

    register('lasts', Prelude.map(Prelude.lasts));

    register('inits', Prelude.map(Prelude.inits));

    register('tails', Prelude.map(Prelude.tails));

    register('isPrefixOf', function _isPrefixOf(prefix, string) {
        for (var i = 0; i < prefix.length; i++) {
            if (string[i] !== prefix[i]) {
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
            return Prelude.map(listToString, [ as, bs ]);
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
        return Prelude.findIndex(Prelude.eq(x), xs);
    });

    register('elemIndices', function _elemIndex(x, xs) {
        return Prelude.findIndices(Prelude.eq(x), xs);
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
        if (xs.length <= 1) {
            return xs;
        }
        var zs = isString(xs) ? "".split.call(xs, '') : [].slice.call(xs);
        if (isNumber(zs[0])) {
            zs.sort(function (a, b) { return a - b; });
        } else if (isString(zs[0])) {
            zs.sort(function (a, b) { return a.localeCompare(b); });
        } else {
            zs.sort(Prelude.compare);
        }
        return isString(xs) ? zs.join('') : zs;
    });

    register('deleteBy', function (p, x, xs) {
        for (var i = 0; i < xs.length; i++) {
            if (p(x, xs[i])) {
                return Prelude.append(xs.slice(0,i), xs.slice(i+1));
            }
        }
        return xs;
    });

    register('delete', 'delete_', function _delete(x, xs) {
        var i = xs.indexOf(x);
        if (i >= 0) {
            return Prelude.append(xs.slice(0,i), xs.slice(i+1));
        }
        return xs;
    });

    register('insertBy', function (f, x, xs) {
        for (var i = 0; i < xs.length; i++) {
            if (f(x, xs[i]) <= 0) {
                return Prelude.concat([xs.slice(0,i), x, xs.slice(i)]);
            }
        }
        return xs;
    });

    register('insert', Prelude.insertBy(Prelude.compare));

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
        return isString(xs) ? Prelude.map(listToString, zs) : zs;
    });

    register('group', Prelude.groupBy(Prelude['==']));

    register('sortBy', function (fn, xs) {
        if (xs.length <= 1) {
            return xs;
        }
        var zs = isString(xs) ? "".split.call(xs, '') : [].slice.call(xs);
        zs.sort(fn);
        return isString(xs) ? zs.join('') : zs;
    });

    register('maximumBy', function (f, xs) {
        return Prelude.foldl1(function (a, b) {
            if (f(a, b) > 0) {
                return a;
            }
            return b;
        }, xs);
    });

    register('minimumBy', function (f, xs) {
        return Prelude.foldl1(function (a, b) {
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

    register('listToMaybe', function _listToMaybe(xs) { return xs[0]; });

    register('maybeToList', function _maybeToList(maybe) {
        if (maybe === undefined || maybe === null) {
            return [];
        }
        return [maybe];
    });

    register('catMaybes', Prelude.filter(Prelude.isJust));

    register('mapMaybe', Prelude.compose2(Prelude.filter(Prelude.isJust), Prelude.map));


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
        return (val.right !== undefined || val[1] !== undefined) && !Prelude.isLeft(val);
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

    register('lefts', Prelude.compose(
                Prelude.map(Prelude.fromLeft),
                Prelude.filter(Prelude.isLeft)
    ));

    register('rights', Prelude.compose(
                Prelude.map(Prelude.fromRight),
                Prelude.filter(Prelude.isRight)
    ));

    register('partitionEithers', function _partitionEithers(xs) {
        return [ Prelude.lefts(xs), Prelude.rights(xs) ];
    });

    return Prelude;
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
}

}());
