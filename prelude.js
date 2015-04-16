var Prelude = {};

var freeze = Object.freeze || function (x) { return x; };

var isArray = Array.isArray || function(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};

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

/* curry/uncurry - omitted */

/* Bounded - omitted */


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

function _and(a, b) {
    return a && b;
}
Prelude.and = func(_and);

function _or(a, b) {
    return a || b;
}
Prelude.or = func(_or);

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
Prelude.eq = func(_eq);

function _neq(a, b) {
    return a !== b;
}
Prelude.neq = func(_neq);


// Ord

function _lt(a, b) {
    return a < b;
}
Prelude.lt = func(_lt);

function _gt(a, b) {
    return a > b;
}
Prelude.gt = func(_gt);

function _lte(a, b) {
    return a <= b;
}
Prelude.lte = func(_lte);

function _gte(a, b) {
    return a >= b;
}
Prelude.gte = func(_gte);

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
    return Math.sign(a - b);
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
Prelude.add = func(_add);
Prelude['+'] = Prelude.add;

function _sub(a, b) {
    return a - b;
}
Prelude.sub = func(_sub);
Prelude['-'] = Prelude.sub;

function _mul(a, b) {
    return a * b;
}
Prelude.mul = func(_mul);
Prelude['*'] = Prelude.mul;

Prelude.abs = func(Math.abs);

function _negate(a) {
    return -a;
}
Prelude.negate = func(_negate);

Prelude.signum = func(Math.sign);


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
    return Math.sign(r) == -Math.sign(b) ? r + b : r;
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

Prelude.sinh = func(Math.sinh);
Prelude.tanh = func(Math.tanh);
Prelude.cosh = func(Math.cosh);

/* asinh, atanh, acosh */


// RealFrac

function _properFraction(x) {
}

function _truncate(x) {
    switch (Math.sign(x)) {
    case -1:
        return Math.ceil(x);
    case 1:
        return Math.floor(x);
    }
    return 0;
}

function _round(x) {
}

function _ceiling(x) {
    return Math.ceil(x);
}

function _floor(x) {
    return Math.floor(x);
}

// RealFloat

/* ... */


// Numeric

/* even, odd, gcd, lcm, ^, ^^ */


// Monad (>>=, >>, return, fail) - omitted

// Functor (fmap) - omitted

/* mapM, mapM_, sequence, sequence_, =<< - omitted */


/*  until
 *  asTypeOf - omitted
 *  error
 *  undefined
 *  seq
 *  $!
 */

function _map(f, xs) {
    var ys = isArray(xs) ? [] : {};
    Object.keys(xs).forEach(function (key) {
        ys[key] = xs[key];
    });
    return ys;
}
Prelude.map = func(_map);

function _append(xs, ys) {
    var zs = [];
    [].push.apply(zs, xs);
    [].push.apply(zs, ys);
    return zs;
}
Prelude.append = func(_append);
Prelude['++'] = Prelude.append;

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

/*  intersperse
 *  intercalate
 *  transpose
 *  subsequences
 *  permutations
 *
 *  foldl'
 *  foldl1'
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

function _foldl(f, x, xs) {
}
Prelude.foldl = func(_foldl);

function _foldl1(f, xs) {
}
Prelude.foldl1 = func(_foldl1);

function _foldr(f, x, xs) {
}
Prelude.foldr = func(_foldr);

function _foldr1(f, xs) {
}
Prelude.foldr1 = func(_foldr1);

//function _and(xs) {
//}
//Prelude.and = func(_and);

/*
 *  and
 *  or
 *  any
 *  all
 *  sum
 *  product
 *  concat
 *  concatMap
 *  maximum
 *  minimum
 *
 *  scanl
 *  scanl1
 *  scanr
 *  scanr1
 *
 *  iterate
 *  repeat
 *  replicate
 *  cycle
 *
 *  take
 *  drop
 *  splitAt
 *  takeWhile
 *  dropWhile
 *  span
 *  break
 *
 *  elem
 *  notElem
 *  lookup
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
 *
 *  ShowS
 *  Show (show, showsPrec, showList)
 *  shows
 *  showChar
 *  showString
 *  showParen
 *
 *  ReadS
 *  Read (readsPrec, readPrec, readList)
 *  reads
 *  readParen
 *  read
 *  lex
 *
 *  putChar
 *  putStr
 *  putStrLn
 *  print
 *
 *  getChar
 *  getLine
 *  getContents
 *  interact
 *
 *  FilePath
 *  readFile
 *  writeFile
 *  appendFile
 *  readIO
 *  readLn
 *
 *  IOError
 *  ioError
 *  userError
 */

module.exports = Prelude;
