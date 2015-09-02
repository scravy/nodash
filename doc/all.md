`(a → Bool) → [a] → Bool`

Applied to a predicate and a list, all determines if all elements of the list
satisfy the predicate.

Example:

	all(even, [1, 2, 3]) === false
	all(lte(3), [1, 2, 3]) === true

This function does work with strings too:

    all(isDigit, "123") === true


