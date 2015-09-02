`(a -> Bool) -> [a] -> Bool`

Applied to a predicate and a list, any determines if any element of the list
satisfies the predicate.

Example:

	any(even, [1, 2, 3]) === true
	any(gt(3), [1, 2, 3]) === false

This function does work with strings too:

    any(isAsciiLetter, "17e9") === true

