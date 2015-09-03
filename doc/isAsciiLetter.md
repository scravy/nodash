`String → Bool`

Determines whether the given String or Character is an ascii letter, that is: Matching the regular expression `/^[a-zA-Z]+$/`.

Example:

	isAsciiLetter('X') === true
	isAsciiLetter('@') === false
	isAsciiLetter('8') === false


