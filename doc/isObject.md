`Someting → Bool`

Determine whether something is an object, but not an array nor `null`.

Example:

	isObject({}) === true
	isObject(7) === false
	isObject("") === false
	isObject([]) === false
	isObject(null) === false
	isObject(undefined) === false
