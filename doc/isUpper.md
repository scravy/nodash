`String → Bool`

Determines whether all characters in the given string are alphabetic upper case characters.

Note that this function only considers characters to be letters if they have an upper case and a lower case variant.

Example:

	isUpper("HELLO") === true
	isUpper("hello") === false
	isUpper("hELLO") === false
	isUpper("8") === false
	isUpper("HELLO7") === false
