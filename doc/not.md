`Bool → Bool`

Boolean "not".

This is exactly the same as the unary `!` operator but in function form.
This way it can be refered to as a value and used in higher order functions.

Example:

	eq(map(not, [0, 1, 2]), [true, false, false]) === true