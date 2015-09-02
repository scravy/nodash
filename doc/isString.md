`Something → Bool`

Determines whether something is a String or not. Equivalent to `typeof x === 'string'`.

Example:

	isString("hello") === true
	isString(undefined) === false
	isString(42) === false
	isString({}) === false
