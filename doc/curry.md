`((a, b) → c) → a → b → c`

Turns a function that accepts a tuple into its curried version.
The curried function will have one argument and returns another
function that again accepts one argument and finally returns the
result the original function would have.

It is a little bit odd that this function accepts as argument
a function that itself has only one argument which is a tuple.
It is defined this way to maintain consistency with the way tuples
are modeled in `nodash`: As arrays with two elements. This way it
acts like its signature (lended from Haskell) promises.

If you want to turn functions that accept two arguments into their
properly curried versions, use `curried`.

Example:
    
	var f = curry(function (x) { return fst(x) + snd(x); });
	eq(zipWith(f, [ 1, 2, 3 ], [ 3, 2, 1 ]), [ 4, 4, 4 ]) === true

