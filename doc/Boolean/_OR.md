`Bool → Bool → Bool`

Booleanm "or". This is effectively just making the `&&` operator
available as a curried function.

Example:

```JavaScript
OR(false, true) === true
OR(false)(false) === false
foldl(OR, false, [ true, false ]) === true
```
