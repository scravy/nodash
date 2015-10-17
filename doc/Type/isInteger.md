`Any → Boolean`

Returns `true` is the argument is an integral number.

Numbers in JavaScript are floating point values and there is no proper integer type.
This function can be used to check whether a given number could be cast to an
integer without truncating.

```JavaScript
isInteger(7) === true
isInteger(7.0) === true
isInteger(7.3) === false
```
