`Something → Bool`

Determines whether something is an array or not. This is exactly the same as `Array.isArray`, except that is is polyfilled in environments which do not provide it.

Example:

	isArray([]) === true
	isArray({}) === false
	isArray(new Array(3)) === true
	isArray(undefined) === false
	isArray(3) === false

