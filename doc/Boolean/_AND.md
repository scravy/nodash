`Bool → Bool → Bool`

Boolean "and". This is effectively just making the `&&` operator
available as a curried function.

Example:

```JavaScript
AND(true, true) === true
AND(false)(true) === false
foldl(AND, true, [ true, false ]) === false
```
