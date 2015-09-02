`Something → Bool`

Determines whether something is a number or not. The same as `typeof x === 'number'`.

Example:

	isNumber(18e3) === true
	isNumber("18") === false
	isNumber(139) === true
	isNumber("") === false
	isNumber([3]) === false
