`Any → Boolean`

Returns `true` is the argument is a regular expression object.

Example:

```JavaScript
isRegExp(/a+/) === true
isRegExp("a+") === false
isRegExp(new RegExp("a+")) === true
```
