var Prelude = {};

var freeze = Object.freeze || function (x) { return x; };

var isArray = Array.isArray || function(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};

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
        return f(a, b, c);
        }
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
        return f(a, b, c, d);
        }
    });
}

function func(f) {
    switch (f.length) {
    case 1:
        return func1(f);
    case 2:
        return func2(f);
    case 3:
        return func3(f);
    case 4:
        return func4(f);
    }
}

// Function

function _id(x) {
    return x;
}
Prelude.id = func1(_id);

function _const(a, b) {
    return a;
}
Prelude.const = func2(_const);

function _apply(f, x) {
    return f(x);
}
Prelude.apply = func2(_apply);
Prelude['$'] = Prelude.apply;

function _compose(f, g, x) {
    return f(g(x));
}
Prelude.compose = func3(_compose);
Prelude['.'] = Prelude.compose;

function _flip(f) {
    return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        args[0] = arguments[1];
        args[1] = arguments[0];
        return f.apply(null, args);
    };
}
Prelude.flip = func(_flip);

function _on(g, f, a, b) {
    return g(f(a), f(b))
}
Prelude.on = func(_on);


// Maybe

function _maybe(def, fun, maybe) {
    if (maybe === undefined || maybe === null) {
        return def;
    }
    return fun(maybe);
}
Prelude.maybe = func(_maybe);

function _isJust(value) {
    return value !== undefined && value !== null;
}
Prelude.isJust = func(_isJust);

function _isNothing(value) {
    return value === undefined || value === null;
}
Prelude.isNothing = func(_isNothing);

function _fromMaybe(def, maybe) {
    if (maybe === undefined || maybe === null) {
        return def;
    }
    return maybe;
}
Prelude.fromMaybe = func(_fromMaybe);
/* Prelude.fromMaybe = _flip(maybe)(id); */

function _listToMaybe(xs) {
    return xs[0];
}
Prelude.listToMaybe = func(_listToMaybe);

function _maybeToList(maybe) {
    if (maybe === undefined || maybe === null) {
        return [];
    }
    return [maybe];
}
Prelude.maybeToList = func(_maybeToList);

function _catMaybes(xs) {
    return _filter(_isJust, xs);
}
Prelude.catMaybes = func(_catMaybes);

function _mapMaybe(f, xs) {
    return _filter(_isJust, _map(f, xs));
}
Prelude.mapMaybe = func(_mapMaybe);


// Either

function _either(afun, bfun, either) {
    var left = either.left || either[0];
    if (left) {
        return afun(left);
    }
    var right = either.right || either[1];
    if (right) {
        return bfun(right);
    }
    return null;
}
Prelude.either = func(_either);

function _Left(value) {
    return { left: value };
}
Prelude.Left = func(_Left);

function _Right(value) {
    return { right: value };
}
Prelude.Right = func(_Right);

function _isLeft(val) {
    return val.left !== undefined || (val[0] !== undefined && val[0] !== null);
}
Prelude.isLeft = func(_isLeft);

function _isRight(val) {
    return (val.right !== undefined || val[1] !== undefined) && !_isLeft(val);
}
Prelude.isRight = func(_isRight);

function _lefts(xs) {
    return _filter(_isLeft, xs);
}
Prelude.lefts = func(_lefts);

function _rights(xs) {
    return _filter(_isRight, xs);
}
Prelude.rights = func(_rights);

function _partitionEithers(xs) {
    return [ _lefts(xs), _rights(xs) ];
}
Prelude.partitionEithers = func(_partitionEithers);


// Bool

function _AND(a, b) {
    return a && b;
}
Prelude.AND = func(_AND);
Prelude['&&'] = Prelude.AND;

function _OR(a, b) {
    return a || b;
}
Prelude.OR = func(_OR);
Prelude['||'] = Prelude.OR;

function _not(value) {
    return !value;
}
Prelude.not = func(_not);

function _bool(yes, no, bool) {
    return bool ? yes : no;
}
Prelude.bool = func(_bool);


// Tuple

function _fst(arr) {
    return arr[0];
}
Prelude.fst = func(_fst);

function _snd(arr) {
    return arr[1];
}
Prelude.snd = func(_snd);


// Eq

function _eq(a, b) {
    return a === b;
}
Prelude.eq    = func(_eq);
Prelude.EQ    = Prelude.eq;
Prelude['=='] = Prelude.eq;

function _neq(a, b) {
    return a !== b;
}
Prelude.neq   = func(_neq);
Prelude.NEQ   = Prelude.neq;
Prelude['/='] = Prelude.neq;


// Ord

function _lt(a, b) {
    return a < b;
}
Prelude.lt   = func(_lt);
Prelude.LT   = Prelude.lt;
Prelude['<'] = Prelude.lt;

function _gt(a, b) {
    return a > b;
}
Prelude.gt   = func(_gt);
Prelude.GT   = Prelude.gt;
Prelude['>'] = Prelude.gt;

function _lte(a, b) {
    return a <= b;
}
Prelude.lte   = func(_lte);
Prelude.LTE   = Prelude.lte;
Prelude['<='] = Prelude.lte;

function _gte(a, b) {
    return a >= b;
}
Prelude.gte   = func(_gte);
Prelude.GTE   = Prelude.gte;
Prelude['>='] = Prelude.gte;

function _max(a, b) {
    if (a > b) {
        return a;
    }
    return b;
}
Prelude.max = func2(_max);

function _min(a, b) {
    if (a < b) {
        return a;
    }
    return b;
}
Prelude.min = func(_min);

function _compare(a, b) {
    return _signum(a - b);
}
Prelude.compare = func(_compare);

function _comparing(f, a, b) {
    return _compare(f(a), f(b));
}
Prelude.comparing = func(_comparing);


// Num

function _add(a, b) {
    return a + b;
}
Prelude.add  = func(_add);
Prelude.plus = Prelude.add;
Prelude.PLUS = Prelude.add;
Prelude['+'] = Prelude.add;

function _sub(a, b) {
    return a - b;
}
Prelude.sub      = func(_sub);
Prelude.subtract = Prelude.sub;
Prelude.minus    = Prelude.sub;
Prelude.SUB      = Prelude.sub;
Prelude.MINUS    = Prelude.sub;
Prelude['-']     = Prelude.sub;

function _mul(a, b) {
    return a * b;
}
Prelude.mul   = func(_mul);
Prelude.times = Prelude.mul;
Prelude.MUL   = Prelude.mul;
Prelude.TIMES = Prelude.mul;
Prelude['*']  = Prelude.mul;

Prelude.abs = func(Math.abs);

function _negate(a) {
    return -a;
}
Prelude.negate = func(_negate);

function _signum(x) {
    if (x < 0) {
        return -1;
    } else if (x > 0) {
        return 1;
    }
    return 0;
}
Prelude.signum = func(_signum);


// Integral

function _div(a, b) {
    return Math.floor(a / b);
}
Prelude.div = func(_div);

function _quot(a, b) {
    var r = a / b;
    return r >= 0 ? Math.floor(r) : Math.ceil(r);
}
Prelude.quot = func(_quot);

function _rem(a, b) {
    return a % b;
}
Prelude.rem = func(_rem);

function _mod(a, b) {
    var q = _quot(a, b);
    var r = _rem(a, b);
    return _signum(r) == -_signum(b) ? r + b : r;
}
Prelude.mod = func(_mod);

function _divMod(a, b) {
    return [_div(a, b), _mod(a, b)];
}
Prelude.divMod = func(_divMod);

function _quotRem(a, b) {
    return [_quot(a, b), _rem(a, b)];
}
Prelude.quotRem = func(_quotRem);


// Fractional

function _frac(a, b) {
    return a / b;
}
Prelude.frac = func(_frac);
Prelude['/'] = Prelude.frac;

function _recip(a) {
    return 1 / a;
}
Prelude.recip = func(_recip);


// Floating

Prelude.exp = func(Math.exp);
Prelude.sqrt = func(Math.sqrt);
Prelude.log = func(Math.log);

function _logBase(a, b) {
    return Math.log(a) / Math.log(b);
}
Prelude.logBase = func(_logBase);

Prelude.pow = func2(Math.pow);
Prelude['**'] = Prelude.pow;

Prelude.sin = func(Math.sin);
Prelude.tan = func(Math.tan);
Prelude.cos = func(Math.cos);

Prelude.asin = func(Math.asin);
Prelude.atan = func(Math.atan);
Prelude.acos = func(Math.acos);

Prelude.sinh = func(Math.sinh || function (x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
});

Prelude.tanh = func(Math.tanh || function(x) {
    if (x === Infinity) {
        return 1;
    } else if (x === -Infinity) {
        return -1;
    } else {
        return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
    }
});

Prelude.cosh = func(Math.cosh || function(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
});

Prelude.asinh = func(Math.asinh || function(x) {
    if (x === -Infinity) {
      return x;
    } else {
        return Math.log(x + Math.sqrt(x * x + 1));
    }
};);

Prelude.atanh = func(Math.atanh || function(x) {
  return Math.log((1 + x) / (1 - x)) / 2;
};);

Prelude.acosh = func(Math.acosh || function(x) {
  return Math.log(x + Math.sqrt(x * x - 1));
};);


// RealFrac

function _properFraction(x) {
    var num = _truncate(x);
    return [ num, -(num - x) ];
}
Prelude.properFraction = func(_properFraction);

function _truncate(x) {
    switch (_signum(x)) {
    case -1:
        return Math.ceil(x);
    case 1:
        return Math.floor(x);
    }
    return 0;
}
Prelude.truncate = func(_truncate);

function _round(x) {
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
}
Prelude.round = func(_round);

Prelude.ceiling = func(Math.ceil);
Prelude.floor   = func(Math.floor);

// RealFloat

/* ... */


// Numeric

function _gcd(a, b) {
    var c;
    while (b !== 0) {
        c = _rem(a, b);
        a = b;
        b = c;
    }
    return a;
}
Prelude.gcd = func(_gcd);

function _lcm(a, b) {
    if (a == 0 || b == 0) {
        return 0;
    }
    return Math.abs(_quot(a, _gcd(a, b)) * b);
}
Prelude.lcm = func(_lcm);

Prelude['^'] = Prelude.pow;
Prelude['^^'] = Prelude.pow;

function _even(x) {
    return x % 2 === 0;
}
Prelude.even = func(_even);

function _odd(x) {
    return x % 2 !== 0;
}
Prelude.odd = func(_odd);


// Control

function _until(p, f, v) {
    while (!p(v)) {
        v = f(v);
    }
    return v;
}
Prelude.until = func(_until);


// List

function _cons(x, xs) {
    var zs = [x];
    [].push.apply(zs, xs);
    return zs;
}
Prelude.cons = func(_cons);
Prelude[':'] = Prelude.cons;

function _append(xs, ys) {
    var zs = [];
    [].push.apply(zs, xs);
    [].push.apply(zs, ys);
    return zs;
}
Prelude.append = func(_append);
Prelude['++'] = Prelude.append;

function _map(f, xs) {
    var ys = isArray(xs) ? [] : {};
    Object.keys(xs).forEach(function (key) {
        ys[key] = xs[key];
    });
    return ys;
}
Prelude.map = func(_map);

function _filter(p, xs) {
    var ys = isArray(xs) ? [] : {};
    Object.keys(xs).forEach(function (key) {
        if (p(xs[key])) {
            ys[key] = xs[key];
        }
    });
    return ys;
}
Prelude.filter = func(_filter);

function _head(xs) {
    return xs[0];
}
Prelude.head = func(_head);

function _last(xs) {
    return xs[xs.length - 1];
}
Prelude.last = func(_last);

function _tail(xs) {
    return xs.slice(1);
}
Prelude.tail = func(_tail);

function _init(xs) {
    return xs.slice(0, xs.length - 1);
}
Prelude.init = func(_init);

function _null(xs) {
    return xs.length === 0;
}
Prelude.null = func(_null);

function _length(xs) {
    return xs.length;
}
Prelude.length = func(_length);

function _at(xs, ix) {
    return xs[ix];
}
Prelude.at = func(_at);
Prelude['!!'] = Prelude.at;

function _reverse(xs) {
    var zs = [];
    for (var i = 0; i < xs.length; i++) {
        zs[xs.length - i - 1] = xs[i];
    }
    return zs;
}
Prelude.reverse = func(_reverse);

function _take(n, xs) {
    return xs.slice(0, n);
}
Prelude.take = func(_take);

function _drop(n, xs) {
    return xs.slice(n);
}
Prelude.drop = func(_drop);

function _splitAt(n, xs) {
    return [ _take(n, xs), _drop(n, xs) ];
}
Prelude.splitAt = func(_splitAt);

function _takeWhile(p, xs) {
    var i = 0;
    while (i < xs.length && !p(xs[i])) {
        i++;
    }
    return xs.slice(0, i);
}
Prelude.takeWhile = func(_takeWhile);

function _dropWhile(p, xs) {
    var i = 0;
    while (i < xs.length && p(xs[i])) {
        i++;
    }
    return xs.slice(i);
}
Prelude.dropWhile = func(_dropWhile);

function _span(p, xs) {
    var i = 0;
    while (i < xs.length && p(xs[i])) {
        i++;
    }
    return [ xs.slice(0, i), xs.slice(i) ];    
}
Prelude.span = func(_span);

function _break(p, xs) {
    var i = 0;
    while (i < xs.length && !p(xs[i])) {
        i++;
    }
    return [ xs.slice(0, i), xs.slice(i) ];
}
Prelude.break = func(_break);

function _elem(x, xs) {
    var keys = Objects.keys(xs);
    for (var i = 0; i < keys.length; i++) {
        if (xs[i] === x) {
            return true;
        }
    }
    return false;
}
Prelude.elem = func(_elem);

function _notElem(x, xs) {
    var keys = Objects.keys(xs);
    for (var i = 0; i < keys.length; i++) {
        if (xs[i] === x) {
            return false;
        }
    }
    return true;
}
Prelude.notElem = func(_notElem);

function _lookup(x, xs) {
    if (isArray(xs)) {
        for (var i = 0; i < keys.length; i++) {
            if (xs[i] && xs[i][0] === x) {
                return xs[i][1];
            }
        }
    }
    return xs[x];
}
Prelude.lookup = func(_lookup);

function _foldl(f, x, xs) {
    for (var i = 0; i < xs.length; i++) {
        x = f(x, xs[i]);
    }
    return x;
}
Prelude.foldl = func(_foldl);
Prelude['foldl\''] = Prelude.foldl;

function _foldl1(f, xs) {
    var x = xs[0];
    for (var i = 1; i < xs.length; i++) {
        x = f(x, xs[i]);
    }
    return x;
}
Prelude.foldl1 = func(_foldl1);
Prelude['foldl1\''] = Prelude.foldl1;

function _foldr(f, x, xs) {
    for (var i = xs.length - 1; i >= 0; i--) {
        x = f(xs[i], x);
    }
    return x;
}
Prelude.foldr = func(_foldr);

function _foldr1(f, xs) {
    var x = xs[xs.length - 1];
    for (var i = xs.length - 2; i >= 0; i--) {
        x = f(xs[i], x);
    }
    return x;
}
Prelude.foldr1 = func(_foldr1);

Prelude.and     = Prelude.foldl(_AND, true);
Prelude.or      = Prelude.foldl(_OR, false);
Prelude.sum     = Prelude.foldl(_add, 0);
Prelude.product = Prelude.foldl(_mul, 1);
Prelude.maximum = Prelude.foldl(_max, -Infinity);
Prelude.minimum = Prelude.foldl(_min, +Infinity);

function _any(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i]) {
            return true;
        }
    }
    return false;
}
Prelude.any = func(_any);

function _all() {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i]) {
            return false;
        }
    }
    return true;
}
Prelude.all = func(_all);



function _scanl(f, x, xs) {
    var zs = [x];
    for (var i = 0; i < xs.length; i++) {
        x = f(x, xs[i]);
        zs.push(x);
    }
    return zs;
}
Prelude.scanl = func(_scanl);

function _scanl1(f, xs) {
    var x = xs[0];
    var zs = [x];
    for (var i = 1; i < xs.length; i++) {
        x = f(x, xs[i]);
        zs.push(x);
    }
    return zs;
}
Prelude.scanl1 = func(_scanl1);

function _scanr(f, x, xs) {
    var zs = [x];
    for (var i = xs.length - 1; i >= 0; i--) {
        x = f(xs[i], x);
        zs.push(x);
    }
    return zs;
}
Prelude.scanr = func(_scanr);

function _scanr1(f, xs) {
    var x = xs[xs.length - 1];
    var zs = [x];
    for (var i = xs.length - 2; i >= 0; i--) {
        x = f(xs[i], x);
        zs.push(x);
    }
    return zs;
}
Prelude.scanr1 = func(_scanr1);



/*
 *  concat
 *  concatMap
 *
 *  iterate
 *  repeat
 *  replicate
 *  cycle
 *
 *  zip
 *  zip3
 *  zipWith
 *  zipWith3
 *  unzip
 *  unzip3
 *
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
//Prelude.and = func(_and);

module.exports = Prelude;
