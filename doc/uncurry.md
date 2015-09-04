`(a → b → c) → (a, b) → c`

Turns a function that accepts two arguments into a function that accepts as single
argument a tuple. Tuple in `nodash` are realized as arrays of two elements.

Example:

	eq(map(uncurry(Math.min), zip([1, 2, 3], [3, 2, 1])), [1, 2, 1]) === true
