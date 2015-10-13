`Boolean → Boolean → Boolean`

Boolean "and". This is effectively just making the `&&` operator
available as a curried function.

Not to be confused with the lower case [and](#f-and).

Example:

```JavaScript
AND(true, true) === true
AND(false)(true) === false
foldl(AND, true, [ true, false ]) === false
```
