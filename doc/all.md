`(a -> Bool) -> [a] -> Bool`

Applied to a predicate and a list, all determines if all elements of the list satisfy the predicate. For the result to be True, the list must be finite; False, however, results from a False value for the predicate applied to an element at a finite index of a finite or infinite list.

Example:

	all(even, [1, 2, 3]) === false
	all(lte(3), [1, 2, 3]) === true

