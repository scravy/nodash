Changelog
=========


v0.3 "Amdahl"
-------------

+ has a coverage of ≥50%
+ supports almost all of Haskell 2010s `Prelude` (except for some delicate stuff like curry, uncurry)
+ has its own mechanism for currying/uncurrying/partially applying JavaScript functions
+ also covers some of the functions from `Data.List`


v0.4 "Babbage"
--------------

+ has a coverage of ≥80%
+ supports almost all of Haskell 2010s Prelude (except for some delicate stuff like curry, uncurry)
+ supports most of `Data.List` too
+ has its own mechanism for currying/uncurrying/partially applying JavaScript functions
+ should also work in the browser now
+ should play nice with AMD loaders now too
+ 3.7 KB minified + gzipped


v0.5 "Curry"
------------

+ has a function coverage of 100% and overall coverage of ≥96%
  (statements, lines: ≥99%, branches: 96%)
+ `eq` supports object/array comparison
+ `compare` supports objects featuring `compareTo` and respects `toString`
+ set functions added (`intersect`, `union`, `difference`, ...)
+ 4.5 KB minified + gzipped
+ list functions work equally well with strings
+ some functions also play nice with objects (`filter`, `map`, `transpose`, ...)


v0.6 "Dijkstra"
----------------

+ Streams! (`stream` aka `lazy`, `consume`, `consumeString`)
  + not all functions which could support it support it yet
+ Infinte Streams!
+ `repeat`, `iterate`, ...
+ ~100% code coverage.
+ ~5KB minified + gzipped
+ `each` for iterating over arrays, objects, and streams

### v0.6.1

+ Changed name from `node-prelude` to `nodash`.


v0.7 "Eich"
-----------

+ `isInfinite` exported as utility function.
+ `keys` for enumerating the keys of an object.
+ `cycle` /w array, string, object, streams, and inifinite streams.
+ `pipe` for chaining functions.
+ Reproduces the complete Haskell 2010 Prelude.
+ All occurences of `Prelude` are now `Nodash`.

### v0.7.1

+ Added a lot documentation.


v0.8 "Floyd"
------------

+ Tasks! The new `run` function allows you do declare a schedule with
  dependencies between tasks which is scheduled asynchronously.
+ `async` added - turns ordinary functions into asynchronous functions,
+ `isObject` added - checks if something is an object but not an array
   and not `null`.
+ renamed `isNull` to `isEmpty`.
+ `clone` added to create deep copies of objects.

### v0.8.1

Nodash v0.8 would not work in browsers as it references `setImmediate`
which is only available in NodeJS. This patch fixes that.

### v0.8.2

+ `install` completely refactored:
  + allows for specifying an array as mountpoint with pre- and postfixes
  which are added to the names of the functions.
  + shows up in the API doc now.


v0.9 "Gosling"
--------------

+ Added benchmarks, can be run with `node benchmark`.
+ `invoke` added - `invoke(f)` invokes the function `f` (useful with map etc.).
+ `values` added - creates an array from the values of an object.
+ `at` and `select` will return `undefined` now if invoked on `undefined`.
+ `isUpper` added - checks if a string is all upper case.
+ `isLower` added - checks if a string is all lower case.
+ `isNumeric` added - checks if a string is numeric (`/^[0-9]+$/`).
+ `ord` added - returns the unicode code point for the given character.
+ `chr` added - returns the character for the given unicode code point.
+ `lasts` and `heads` removed - they were added in a bleary-eyed night
  and do not make any sense at all.
+ `inits` and `lasts` implemented - they were added but implementations
  were forgotten in that same bleary-eyed night.
  
### v0.9.1

+ `isLetter` added - checks if a strings contains of only alphabetic characters
  where an alphabetic character is something that has an upper case and a lower
  case.
+ `isUpper` and `isLower` now accept strings that also pass `isLetter`.
+ `curried` is not exported via `register` and shows up in the api documentation.

### v0.9.2

+ *experimental:* `curry` and `uncurry` added


v0.10 "Hollerith"
-----------------

**Breaking Changes:**
+ Tuples are no longer implemented by arrays but by a class
  - `fst` and `snd` therefore no longer work with arrays but with Tuples only
+ Streams and infinite Lists were completely revamped. This affects:
  - `lazy` generates a `List`
  - `stream` takes a generator now and generates a `Stream`
  - Functions dealing with old streams are updated to handle `List` and `Stream`
  - `List` and `Stream` have laziness built in by using `Thunk` internally
+ `Either` is now a proper type
  - Functions dealing with `Either` are updated accordingly
+ `consume` and `consumeString` removed in favor of `listToArray` and `listToString`
+ `run` was adapted to fit the node convention of passing the error in the
  first argument

**Additions:**
+ `List` added, along with `listToArray` and `listToString`
  - has the methods `head`, `tail`, and `isEmpty`
+ `Stream` added
  - has the same interface as `List` but designates infinite Lists
+ `Tuple` added
  - has the methods `fst` and `snd`
  - Triples are tuples of tuples `(a, (b, c))`
+ `Either` type added, with constructors `Left` and `Right`
+ `isInteger` added - checks whether something is an integral number
+ `isBoolean` added - checks whether something is a boolean
+ `isUndefined` added - checks whether something is undefined
+ `is` added - flipped shorthand version of `instanceof`
+ `range` and `rangeStep` added - returns lazy lists for the given range

**Other Changes:**
+ Nodash is now built using [browserify](https://github.com/substack/node-browserify)
+ Legacy code like shims for `Array.isArray` and `Object.keys` were removed
  - If you want to support pre-ES5 environments pull in [es5-shim](https://github.com/es-shims/es5-shim)
+ The documentation system has been revamped

### v0.10.1

+ Fixed: Documentation showed up the package.json description for functions which do not have documentation yet.
+ `reduceLeft` and `reduceRight` introduced as aliases for `foldl` and `foldr`.

### v0.10.2

+ `eq` was not working properly with Tuples and not with Lists at all. Fixed.
+ `eq` uses now `Nodash.typeOf` instead of JavaScripts `typeof`
+ Added methods for converting objects into arrays of tuples and vice versa
+ Documentation improved

### v0.10.3

+ Increased code coverage
+ Better support for Lists/Streams in head/tail/length/take


v0.11 "Ichbiah"
---------------

+ Added `permutations` function
+ Added dependency on [nodash/steinhaus-johnson-trotter](https://github.com/nodash/steinhaus-johnson-trotter)

### v0.11.1

+ Fixed the definitions of some functions (proper tuples as return values, async does not leak arguments, etc.)
+ experimentally exporting `register` too
+ added some documentation


v0.12 "Joy"
-----------

+ Added `match` function
+ Cleaned up the code
