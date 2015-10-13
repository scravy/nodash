`[a] → [[a]]`

Generates a list of [permutations](https://en.wikipedia.org/wiki/Permutation)
using the
[Steinhaus-Johnson-Trotter](https://github.com/nodash/steinhaus-johnson-trotter)
algorithm.

This function returns an array of all the permutations if
an array or a string is passed, or a lazily evaluated list if a
list is passed.

Example using a string:

```JavaScript
permutations('abc')
// → [ 'abc', 'acb', 'cab', 'cba', 'bca', 'bac' ]
```

Example using a list:

```JavaScript
permutations(lazy([ 7, 4 ]))
// → [ [ 7, 4 ], [ 4, 7 ] ]
```
