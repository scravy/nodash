`Any → Boolean`

Returns `true` if the argument is a boolean value, otherwise `false`.

Example:

```JavaScript
isBoolean(true) === true
isBoolean(false) === false
isBoolean({}) === false
isBoolean(undefined) === false
isBoolean(0) === false
isBoolean(1) === false
isBoolean("true") === false
```
