`(a → b → c) → (b → a → c)`

`flip(f)` takes its (first) two arguments in the reverse order of `f`.

Example:

```JavaScript
minus(10, 8) === 2
var subtract = flip(minus)
subtract(10, 8) === -2
```
