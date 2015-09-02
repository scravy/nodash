`Something → Bool`

Determines whether something is a function or not. The same as `typeof x === 'function'`.

Example:

	isFunction(Array.isArray) === true
	isFunction(isFunction) === true
	isFunction(true) === false
	isFunction(function () {}) === true
	isFunction(undefined) === false
