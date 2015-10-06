`Something → Bool`

Determines whether something is an array or not.
This is exactly the same as `Array.isArray`.

Example:

```JavaScript
isArray([]) === true
isArray({}) === false
isArray(new Array(3)) === true
isArray(undefined) === false
isArray(3) === false
```
