`String → Bool`

Determines whether the all characters in the given string are alphabetic lower case characters.

Note that this function only considers characters to be letters if they have an upper case and a lower case variant.

Example:

	isUpper("HELLO") === false
	isUpper("hello") === true
	isUpper("hELLO") === false
	isUpper("8") === false
	isUpper("hello7") === false
