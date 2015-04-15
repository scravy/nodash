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
Prelude.flip = func1(_flip);

function _on(g, f, a, b) {
    return g(f(a), f(b))
}
Prelude.on = func4(_on);

/* curry/uncurry - omitted */

/* Bounded - omitted */


// Maybe

function _maybe(def, fun, maybe) {
    if (maybe === undefined || maybe === null) {
        return def;
    }
    return fun(maybe);
}
Prelude.maybe = func3(_maybe);

function _isJust(value) {
    return value !== undefined && value !== null;
}
Prelude.isJust = func(_isJust);

function _isNothing(value) {
    return value === undefined || value === null;
}
Prelude.isNothing = func1(_isNothing);

function _fromMaybe(def, maybe) {
    if (maybe === undefined || maybe === null) {
        return def;
    }
    return maybe;
}
Prelude.fromMaybe = func2(_fromMaybe);
/* Prelude.fromMaybe = _flip(maybe)(id); */

function _listToMaybe(xs) {
    return xs[0];
}
Prelude.listToMaybe = func1(_listToMaybe);

function _maybeToList(maybe) {
    if (maybe === undefined || maybe === null) {
        return [];
    }
    return [maybe];
}
Prelude.maybeToList = func1(_maybeToList);

function _catMaybes(xs) {
    return _filter(_isJust, xs);
}
Prelude.catMaybes = func1(_catMaybes);

function _mapMaybe(f, xs) {
    return _filter(_isJust, _map(f, xs));
}
Prelude.mapMaybe = func2(_mapMaybe);


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
Prelude.either = func3(_either);

function _Left(value) {
    return { left: value };
}
Prelude.Left = func1(_Left);

function _Right(value) {
    return { right: value };
}
Prelude.Right = func1(_Right);

function _isLeft(val) {
    return val.left !== undefined || (val[0] !== undefined && val[0] !== null);
}
Prelude.isLeft = func1(_isLeft);

function _isRight(val) {
    return (val.right !== undefined || val[1] !== undefined) && !_isLeft(val);
}
Prelude.isRight = func1(_isRight);

function _lefts(xs) {
    return _filter(_isLeft, xs);
}
Prelude.lefts = func1(lefts);

function _rights(xs) {
    return _filter(_isRight, xs);
}
Prelude.rights = func1(rights);

function _partitionEithers(xs) {
    return [ _lefts(xs), _rights(xs) ];
}
Prelude.partitionEithers = func1(_partitionEithers);


// Bool

function _and(a, b) {
    return a && b;
}
Prelude.and = func2(_and);

function _or(a, b) {
    return a || b;
}
Prelude.or = func2(_or);

function _not(value) {
    return !value;
}
Prelude.not = func1(_not);

function _bool(yes, no, bool) {
    return bool ? yes : no;
}
Prelude.bool = func3(_bool);


// Tuple

function _fst(arr) {
    return arr[0];
}
Prelude.fst = func1(_fst);

function _snd(arr) {
    return arr[1];
}
Prelude.snd = func1(_snd);


// Eq

function _eq(a, b) {
    return a === b;
}
Prelude.eq = func2(_eq);

function _neq(a, b) {
    return a !== b;
}
Prelude.neq = func2(_neq);


// Ord

function _lt(a, b) {
    return a < b;
}
Prelude.lt = func2(_lt);

function _gt(a, b) {
    return a > b;
}
Prelude.gt = func2(_gt);

function _lte(a, b) {
    return a <= b;
}
Prelude.lte = func2(_lte);

function _gte(a, b) {
    return a >= b;
}
Prelude.gte = func2(_gte);

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
Prelude.min = func2(_min);

function _compare(a, b) {
    return Math.sign(a - b);
}
Prelude.compare = func2(_compare);

function _comparing(f, a, b) {
    return _compare(f a, f b);
}
Prelude.comparing = func3(_comparing);


// Num

function _add(a, b) {
    return a + b;
}
Prelude.add = func2(_add);
Prelude['+'] = Prelude.add;

function _sub(a, b) {
    return a - b;
}
Prelude.sub = func2(_sub);
Prelude['-'] = Prelude.sub;

function _mul(a, b) {
    return a * b;
}
Prelude.mul = func2(_mul);
Prelude['*'] = Prelude.mul;

Prelude.abs = func1(Math.abs);

function _negate(a) {
    return -a;
}
Prelude.negate = func2(_negate);

Prelude.signum = func1(Math.sign);


// Integral

function _div(a, b) {
    return Math.floor(a / b);
}
Prelude.div = func2(_div);

function _quot(a, b) {
    var r = a / b;
    return r >= 0 ? Math.floor(r) : Math.ceil(r);
}
Prelude.quot = func2(_quot);

function _rem(a, b) {
    return a % b;
}
Prelude.rem = func2(_rem);

function _mod(a, b) {
    var q = _quot(a, b);
    var r = _rem(a, b);
    return Math.sign(r) == -Math.sign(b) ? r + b : r;
}
Prelude.mod = func2(_mod);

function _divMod(a, b) {
    return [_div(a, b), _mod(a, b)];
}
Prelude.divMod = func2(_divMod);

function _quotRem(a, b) {
    return [_quot(a, b), _rem(a, b)];
}
Prelude.quotRem = func2(_quotRem);


// Fractional

function _frac(a, b) {
    return a / b;
}
Prelude.frac = func2(frac);
Prelude['/'] = Prelude.frac;

function _recip(a) {
    return 1 / a;
}
Prelude.recip = func1(_recip);


// Floating

Prelude.exp = func1(Math.exp);
Prelude.sqrt = func1(Math.sqrt);
Prelude.log = func1(Math.log);

function _logBase(a, b) {
    return Math.log(a) / Math.log(b);
}
Prelude.logBase = func2(_logBase);

Prelude.pow = func2(Math.pow);
Prelude['**'] = Prelude.pow;

Prelude.sin = func1(Math.sin);
Prelude.tan = func1(Math.tan);
Prelude.cos = func1(Math.cos);

Prelude.asin = func1(Math.asin);
Prelude.atan = func1(Math.atan);
Prelude.acos = func1(Math.acos);

Prelude.sinh = func1(Math.sinh);
Prelude.tanh = func1(Math.tanh);
Prelude.cosh = func1(Math.cosh);

/* asinh, atanh, acosh */


// RealFrac

function _properFraction(x) {
}

function _truncate(x) {
}

function _round(x) {
}

function _ceiling(x) {
}

function _floor(x) {
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
Prelude.map = func2(_map);

/*  ++
 */

function _filter(p, xs) {
    var ys = isArray(xs) ? [] : {};
    Object.keys(xs).forEach(function (key) {
        if (p(xs[key])) {
            ys[key] = xs[key];
        }
    });
    return ys;
}
Prelude.filter = func2(_filter);

/*  head
 *  last
 *  tail
 *  init
 *  null
 *  length
 *  !!
 *  reverse
 */

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

/*  foldl
 *  foldl1
 *  foldr
 *  foldr1
 *
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
