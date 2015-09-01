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
+ ~100% code coverage
+ ~5KB minified + gzipped
+ `each` for iterating over arrays, objects, and streams

### v0.6.1

+ Changed name from `node-prelude` to `nodash`

v0.7 "Eich"
-----------

+ `isInfinite` exported as utility function
+ `keys` for enumerating the keys of an object
+ `cycle` /w array, string, object, streams, and inifinite streams
+ `pipe` for chaining functions
+ Reproduces the complete Haskell 2010 Prelude
+ All occurences of `Prelude` are now `Nodash`

### v0.7.1

+ Added a lot documentation

v0.8 "Floyd"
------------

+ Tasks! The new `run` function allows you do declare a schedule with
  dependencies between tasks which is scheduled asynchronously
+ `async` added - turns ordinary functions into asynchronous functions
+ `isObject` added - checks if something is an object but not an array
   and not `null`
+ renamed `isNull` to `isEmpty`
+ `clone` added to create deep copies of objects

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

+ `invoke` added - `invoke(f)` invokes the function `f` (useful with map etc.)
+ `isNumeric` added - checks if a string is numeric (`/^[0-9]+$/`)
+ `values` added - creates an array from the values of an object
+ Added benchmarks, can be run with `node benchmark`
+ `at` and `select` will return `undefined` now if invoked on `undefined`

