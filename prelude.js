var NativeMath  = Math;
var NativeArray = Array;

function install(Prelude, Math, Array) {

    Math    = Math    || NativeMath;
    Array   = Array   || NativeArray;
    Prelude = Prelude || {};

    var isArray = Array.isArray || function _isArray(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    };

    function register() {
        var f, i, arg, aliases = [];
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
        switch (f.length) {
        case 0:
            break;
        case 1:
            f = func1(f);
            break;
        case 2:
            f = func2(f);
            break;
        case 3:
            f = func3(f);
            break;
        case 4:
            f = func4(f);
            break;
        case 5:
            f = func5(f);
            break;
        case 6:
            f = func6(f);
            break;
        case 7:
            f = func7(f);
            break;
        case 8:
            f = func8(f);
            break;
        }
        for (i = 0; i < aliases.length; i++) {
            Prelude[aliases[i]] = f;
        }
        return f;
    }

    function func1(fn) {
        return function (x) {
            return fn(x);
        };
    }

    function func2(fn) {
        return function (a, b) {
            switch (arguments.length) {
            case 1:
                return function (b) {
                    return fn(a, b);
                };
            }
            return fn(a, b);
        };
    }

    function func3(fn) {
        return function (a, b, c) {
            switch (arguments.length) {
            case 1:
                return func2(function (b, c) {
                    return fn(a, b, c);
                });
            case 2:
                return function (c) {
                    return fn(a, b, c);
                };
            }
            return fn(a, b, c);
        };
    }

    function func4(fn) {
        return function (a, b, c, d) {
            switch (arguments.length) {
            case 1:
                return func3(function (b, c, d) {
                    return fn(a, b, c, d);
                });
            case 2:
                return func2(function (c, d) {
                    return fn(a, b, c, d);
                });
            case 3:
                return function (d) {
                    return fn(a, b, c, d);
                };
            }
            return fn(a, b, c, d);
        };
    }

    function func5(fn) {
        return function (a, b, c, d, e) {
            switch (arguments.length) {
            case 1:
                return func4(function (b, c, d, e) {
                    return fn(a, b, c, d, e);
                });
            case 2:
                return func3(function (c, d, e) {
                    return fn(a, b, c, d, e);
                });
            case 3:
                return func2(function (d, e) {
                    return fn(a, b, c, d, e);
                });
            case 4:
                return function (e) {
                    return fn(a, b, c, d, e);
                };
            }
            return fn(a, b, c, d, e);
        };
    }

    function func6(fn) {
        return function (a, b, c, d, e, f) {
            switch (arguments.length) {
            case 1:
                return func5(function (b, c, d, e, f) {
                    return fn(a, b, c, d, e, f);
                });
            case 2:
                return func4(function (c, d, e, f) {
                    return fn(a, b, c, d, e, f);
                });
            case 3:
                return func3(function (d, e, f) {
                    return fn(a, b, c, d, e, f);
                });
            case 4:
                return func2(function (e, f) {
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

    function func7(fn) {
        return function (a, b, c, d, e, f, g) {
            switch (arguments.length) {
            case 1:
                return func6(function (b, c, d, e, f, g) {
                    return fn(a, b, c, d, e, f, g);
                });
            case 2:
                return func5(function (c, d, e, f, g) {
                    return fn(a, b, c, d, e, f, g);
                });
            case 3:
                return func4(function (d, e, f, g) {
                    return fn(a, b, c, d, e, f, g);
                });
            case 4:
                return func3(function (e, f, g) {
                    return fn(a, b, c, d, e, f, g);
                });
            case 5:
                return func2(function (f, g) {
                    return fn(a, b, c, d, e, f, g);
                });
            case 6:
                return function (g) {
                    return fn(a, b, c, d, e, f, g);
                };
            }
            return fn(a, b, c, d, e, f, g);
        };
    }

    function func8(fn) {
        return function (a, b, c, d, e, f, g, h) {
            switch (arguments.length) {
            case 1:
                return func7(function (b, c, d, e, f, g, h) {
                    return fn(a, b, c, d, e, f, g, h);
                });
            case 2:
                return func6(function (c, d, e, f, g, h) {
                    return fn(a, b, c, d, e, f, g, h);
                });
            case 3:
                return func5(function (d, e, f, g, h) {
                    return fn(a, b, c, d, e, f, g, h);
                });
            case 4:
                return func4(function (e, f, g, h) {
                    return fn(a, b, c, d, e, f, g, h);
                });
            case 5:
                return func3(function (f, g, h) {
                    return fn(a, b, c, d, e, f, g, h);
                });
            case 6:
                return func2(function (g, h) {
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


    // Function

    register('id', function _id(x) { return x; });

    register('const', function _const(a, b) { return a; });

    register('$', 'apply', function _apply(f, x) { return f(x); });

    register('.', 'compose', function _compose(f, g, x) { return f(g(x)); });

    register('flip', function _flip(f) {
        return func2(function () {
            var args = [].slice.call(arguments, 0);
            args[0] = arguments[1];
            args[1] = arguments[0];
            return f.apply(null, args);
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

    register('snd', function _snd(snd) { return arr[1]; });

    register(',', function (a, b) { return [ a, b ]; });

    register(',,', function (a, b, c) { return [ a, b, c ]; });

    register(',,,', function (a, b, c, d) { return [ a, b, c, d ]; });

    register(',,,,', function (a, b, c, d, e) { return [ a, b, c, d, e ]; });

    register(',,,,,', function (a, b, c, d, e, f) { return [ a, b, c, d, e, f ]; });

    register(',,,,,,', function (a, b, c, d, e, f, g) { return [ a, b, c, d, e, f, g ]; });


    // Eq

    register('==', 'eq',  'EQ', function _eq(a, b)  { return a === b; });

    register( '/=', 'neq', 'NEQ',function _neq(a, b) { return a !== b; });


    // Ord

    register('<', 'lt', 'LT', function _lt(a, b) { return a < b; });

    register('>', 'gt', 'GT', function _gt(a, b) { return a > b; });

    register('<=', 'lte', 'LTE', function _lte(a, b) { return a <= b; });

    register('>=', 'gte', 'GTE', function _gte(a, b) { return a >= b; });

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
        return Prelude.signum(a - b);
    });

    register('comparing', function _comparing(f, a, b) {
        return Prelude.compare(f(a), f(b));
    });


    // Num

    register('add', 'ADD', 'plus', 'PLUS', '+', function _add(a, b) {
        return a + b;
    });

    register('sub', 'SUB', 'minus', 'MINUS', 'subtract', '-', function _sub(a, b) {
        return a - b;
    });

    register('mul', 'MUL', 'times', 'TIMES', '*', function _mul(a, b) {
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
        var q = _quot(a, b);
        var r = _rem(a, b);
        return _signum(r) == -_signum(b) ? r + b : r;
    });

    register('divMod',  function _divMod(a, b)  { return [_div(a, b),  _mod(a, b)]; });

    register('quotRem', function _quotRem(a, b) { return [_quot(a, b), _rem(a, b)]; });


    // Fractional

    register('frac', '/', function _frac(a, b) { return a / b; });

    register('recip', function _recip(a) { return 1 / a; });


    // Floating

    register('exp',  Math.exp);

    register('sqrt', Math.sqrt);

    register('log',  Math.log);

    register('logBase', function _logBase(a, b) {
        return Math.log(a) / Math.log(b);
    });

    register('pow', '**', '^', '^^', Math.pow);

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


    // List

    register(':', 'cons', function _cons(x, xs) {
        var zs = [x];
        [].push.apply(zs, xs);
        return zs;
    });

    register('++', 'append', function _append(xs, ys) {
        var zs = [];
        [].push.apply(zs, xs);
        [].push.apply(zs, ys);
        return zs;
    });

    register('map', function _map(f, xs) {
        var ys = isArray(xs) ? [] : {};
        Object.keys(xs).forEach(function (key) {
            ys[key] = f(xs[key]);
        });
        return ys;
    });

    register('filter', function _filter(p, xs) {
        var ys = isArray(xs) ? [] : {};
        Object.keys(xs).forEach(function (key) {
            if (p(xs[key])) {
                ys[key] = xs[key];
            }
        });
        return ys;
    });

    register('head', function _head(xs) { return xs[0]; });

    register('last', function _last(xs) { return xs[xs.length - 1]; });

    register('tail', function _tail(xs) { return xs.slice(1); });

    register('init', function _init(xs) { return xs.slice(0, xs.length - 1); });

    register('null', function _null(xs) { return xs.length === 0; });

    register('length', function _length(xs) { return xs.length; });

    register('!!', 'at', 'AT', function _at(xs, ix) { return xs[ix]; });

    register('reverse', function _reverse(xs) {
        var zs = [];
        for (var i = 0; i < xs.length; i++) {
            zs[xs.length - i - 1] = xs[i];
        }
        return zs;
    });

    register('take', function _take(n, xs) {
        return xs.slice(0, n);
    });

    register('drop', function _drop(n, xs) {
        return xs.slice(n);
    });

    register('splitAt', function _splitAt(n, xs) {
        return [ _take(n, xs), _drop(n, xs) ];
    });

    register('takeWhile', function _takeWhile(p, xs) {
        var i = 0;
        while (i < xs.length && !p(xs[i])) {
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
        var keys = Objects.keys(xs);
        for (var i = 0; i < keys.length; i++) {
            if (xs[i] === x) {
                return true;
            }
        }
        return false;
    });

    register('notElem', function _notElem(x, xs) {
        var keys = Objects.keys(xs);
        for (var i = 0; i < keys.length; i++) {
            if (xs[i] === x) {
                return false;
            }
        }
        return true;
    });

    register('lookup', function _lookup(x, xs) {
        if (isArray(xs)) {
            for (var i = 0; i < keys.length; i++) {
                if (xs[i] && xs[i][0] === x) {
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
        var zs = [];
        Object.keys(xs).forEach(function (key) {
            [].push.apply(zs, xs[key]);
        });
        return zs;
    });

    register('concatMap', function (f, xs) {
        return Prelude.concat(Prelude.map(f, xs));
    });

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
                as.length, bs.length, cs.length, ds.length, es.length, fs.length, gs.length]);
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

    register('mapMaybe', function _mapMaybe(f, xs) {
        return _filter(_isJust, _map(f, xs));
    });


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
        return (val.right !== undefined || val[1] !== undefined) && !_isLeft(val);
    });

    register('lefts', Prelude.filter(Prelude.isLeft));

    register('rights', Prelude.filter(Prelude.isRight));

    register('partitionEithers', function _partitionEithers(xs) {
        return [ _lefts(xs), _rights(xs) ];
    });


    // Strings

    register('lines', function _lines(string) {
        return string.split(/\n/);
    });

    register('unlines', function _unlines(lines) {
        return lines.join('\n');
    });

    register('words', function _words(string) {
        return string.split(/\n\r\v\t /);
    });

    register('unwords', function _unwords(words) {
        words.join(' ');
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
        } while (current.length > 0 && zs.push(current));
        return zs;
    });

    register('subsequences', function _subsequences() {

    });

    register('permutations', function _permutations() {

    });

    register('mapAccumL', function _mapAccumL() {
    });

    register('mapAccumR', function _mapAccumR() {
    });

    register('unfoldr', function _unfoldr() {
    });

    register('stripPrefix', function _stripPrefix() {
    });

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

    register('isSuffixOf', function _isSuffixOf() {
        for (var i = 0; i < prefix.length; i++) {
            if (string[string.length - prefix.length] !== prefix[i]) {
                return false;
            }
        }
        return true;
    });

    register('isInfixOf', function _isInfixOf() {
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
        return [ as, bs ];
    });

    register('elemIndex', function _elemIndex() {
    });

    register('elemIndices', function _elemIndices() {
    });

    register('findIndex', function _findIndex() {
    });

    register('findIndices', function _findIndices() {
    });

    register('nub', function _nub() {
    });

    register('delete', function _delete() {
    });

    register('\\\\', function () {
    });

    register('union', function () {
    });

    register('intersect', function () {
    });


    register('sort', function () {
    });

    register('insert', function () {
    });

    register('nubBy', function () {
    });

    register('deleteBy', function () {
    });

    register('unionBy', function () {
    });

    register('intersectBy', function () {
    });

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
        return zs;
    });

    register('group', Prelude.groupBy(Prelude['==']));

    register('sortBy', function () {
    });

    register('insertBy', function () {
    });

    register('maximumBy', function () {
        Prelude.foldl(function (a, b) {
            if (f(a, b) > 0) {
                return a;
            }
            return b;
        }, -Infinity, xs);
    });

    register('minimumBy', function (f, xs) {
        Prelude.foldl(function (a, b) {
            if (f(a, b) < 0) {
                return a;
            }
            return b;
        }, +Infinity, xs);
    });

    return Prelude;
}

module.exports = install({
    install: install
});
