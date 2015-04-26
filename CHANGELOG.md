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

v0.6.1
------

+ Changed name from `node-prelude` to `nodash`

