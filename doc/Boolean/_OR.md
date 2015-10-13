`Boolean → Boolean → Boolean`

Booleanm "or". This is effectively just making the `&&` operator
available as a curried function.

Not to be confused with the lower case [or](#f-or).

Example:

```JavaScript
OR(false, true) === true
OR(false)(false) === false
foldl(OR, false, [ true, false ]) === true
```
