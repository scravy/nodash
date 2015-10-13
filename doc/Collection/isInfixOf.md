`[a] → [a] → Boolean`

The isInfixOf function takes two lists and returns `true`
iff the first list is contained, wholly and intact, anywhere
within the second.

It uses an implementation of the
[Knuth-Morris-Pratt algorithm](https://github.com/nodash/knuth-morris-pratt)
and works with both strings and arrays.
