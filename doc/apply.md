`(a → b) → a → b`

Function application. `apply(f, a, b)` is the same as `f(a, b)`.
It is useful in conjunction with higher order functions.

Example:

	eq(zipWith(apply, [plus(1), times(2)], [3, 5]), [4, 10]) === true