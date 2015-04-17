var Prelude = {};

var freeze = Object.freeze || function (x) { return x; };

var isArray = Array.isArray || function(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};

function register() {
    var f, i, arg, aliases = [];
    for (i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
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
    }
    for (i = 0; i < aliases.length; i++) {
        Prelude[aliases[i]] = f;
    }
    return f;
}

function func1(f) {
    return freeze(function (x) {
        return f(x);
    });
}

function func2(f) {
    return freeze(function (a, b) {
        switch (arguments.length) {
        case 1:
            return function (b) {
                return f(a, b);
            };
        }
        return f(a, b);
    });
}

function func3(f) {
    return freeze(function (a, b, c) {
        switch (arguments.length) {
        case 1:
            return func2(function (b, c) {
                return f(a, b, c);
            });
        case 2:
            return function (c) {
                return f(a, b, c);
            };
        }
        return f(a, b, c);
    });
}

function func4(f) {
    return freeze(function (a, b, c, d) {
        switch (arguments.length) {
        case 1:
            return func3(function (b, c, d) {
                return f(a, b, c, d);
            });
        case 2:
            return func2(function (c, d) {
                return f(a, b, c, d);
            });
        case 3:
            return function (d) {
                return f(a, b, c, d);
            };
        }
        return f(a, b, c, d);
    });
}

// Function

register('id', function _id(x) { return x; });
register('const', function _const(a, b) { return a; });
register('apply', '$', function _apply(f, x) { return f(x); });
register('compose', '.', function _compose(f, g, x) { return f(g(x)); });
register('flip', function _flip(f) {
    return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        args[0] = arguments[1];
        args[1] = arguments[0];
        return f.apply(null, args);
    };
});
register('on', function _on(g, f, a, b) {
    return g(f(a), f(b))
});


// Bool

register('AND', '&&', function _AND(a, b) { return a && b; });
register('OR',  '||', function _OR(a, b) { return a || b; });
register('not', function _not(value) { return !value; });
register('bool', function _bool(yes, no, bool) { return bool ? yes : no; });


// Tuple

register('fst', function _fst(arr) { return arr[0]; });
register('snd', function _snd(snd) { return arr[1]; });


// Eq

register('eq',  'EQ',  '==', function _eq(a, b)  { return a === b; });
register('neq', 'NEQ', '/=', function _neq(a, b) { return a !== b; });


// Ord

register('lt', 'LT', '<', function _lt(a, b) { return a < b; });
register('gt', 'GT', '>', function _gt(a, b) { return a > b; });
register('lte', 'LTE', '<=', function _lte(a, b) { return a <= b; });
register('gte', 'GTE', '>=', function _gte(a, b) { return a >= b; });
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
    return _signum(a - b);
});
register('comparing', function _comparing(f, a, b) {
    return _compare(f(a), f(b));
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
    if (x < 0) {
        return -1;
    } else if (x > 0) {
        return 1;
    }
    return 0;
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
    var fraction = _properFraction(x);
    var n = fraction[0];
    var m = fraction[1] < 0 ? n - 1 : n + 1;
    switch (_signum(Math.abs(fraction[1]) - 0.5)) {
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
        c = _rem(a, b);
        a = b;
        b = c;
    }
    return a;
});
register('lcm', function _lcm(a, b) {
    if (a == 0 || b == 0) {
        return 0;
    }
    return Math.abs(_quot(a, _gcd(a, b)) * b);
});
register('even', function _even(x) { return x % 2 === 0; });
register('odd', function _odd(x) { return x % 2 !== 0; });


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
        ys[key] = xs[key];
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
register('any', function _any(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i]) {
            return true;
        }
    }
    return false;
});
register('all', function _all() {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i]) {
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
        zs.push(x);
    }
    return zs;
});
register('scanr1', function _scanr1(f, xs) {
    var x = xs[xs.length - 1];
    var zs = [x];
    for (var i = xs.length - 2; i >= 0; i--) {
        x = f(xs[i], x);
        zs.push(x);
    }
    return zs;
});
register('concat', function _concat(xs) {
    var zs = [];
    Object.keys(xs).forEach(function (key) {
        zs.push.apply(null, xs[key]);
    });
    return zs;
});
register('concatMap', function _concatMap(f, xs) {
    // TODO
});
register('iterate', function _iterate() {
    // TODO
});
register('repeat', function _repeat() {
    // TODO
});
register('replicate', function _replicate() {
    // TODO
});
register('cycle', function _cycle() {
    // TODO
});
register('zip', function _zip() {
    
});

function _zip3() {
}
Prelude.zip3 = register(_zip3);

function _zip4() {
}
Prelude.zip4 = register(_zip4);

function _zip5() {
}
Prelude.zip5 = register(_zip5);

function _zip6() {
}
Prelude.zip6 = register(_zip6);

function _zip7() {
}
Prelude.zip7 = register(_zip7);

function _zipWith() {
}
Prelude.zipWith = register(_zipWith);

function _zipWith3() {
}
Prelude.zipWith3 = register(_zipWith3);

function _zipWith4() {
}
Prelude.zipWith4 = register(_zipWith4);

function _zipWith5() {
}
Prelude.zipWith5 = register(_zipWith5);

function _zipWith6() {
}
Prelude.zipWith6 = register(_zipWith6);

function _zipWith7() {
}
Prelude.zipWith7 = register(_zipWith7);


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


/*
 *  lines
 *  words
 *  unlines
 *  unwords
 */



/*  intersperse
 *  intercalate
 *  transpose
 *  subsequences
 *  permutations
 *
 *  mapAccumL
 *  mapAccumR
 *
 *  unfoldr
 */

/*  stripPrefix
 *  group
 *  inits
 *  tails
 *
 *  isPrefixOf
 *  isSuffixOf
 *  isInfixOf
 *
 *  find
 *  (filter)
 *  partition
 *
 *  elemIndex
 *  elemIndices
 *  findIndex
 *  findIndices
 *
 *  nub
 *  delete
 *  \\
 *  union
 *  intersect
 *
 *  sort
 *  insert
 *
 *  nubBy
 *  deleteBy
 *  deleteFirstBy
 *  unionBy
 *  intersectBy
 *  groupBy
 *
 *  sortBy
 *  insertBy
 *  maximumBy
 *  minimumBy
 */

//function _and(xs) {
//}
//Prelude.and = register(_and);

module.exports = Prelude;
