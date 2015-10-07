`[(String, Any)] → Object`

Turns an associative list of tuples into an object.

The first components of the tuples are the keys,
the second components the corresponding values.

Example:

```JavaScript
eq( tuplesToObject([ tuple('a', 2), tuple('b', 3) ]), { a: 2, b: 3 }) === true
```
