`Object → [(String, Any)]`

Turns an object into an associative list of tuples.

The objects keys are the first components of the tuples,
the values the second components.

```JavaScript
eq( objectToArray({ a: 17, b: 20 }), [ tuple('a', 17), tuple('b', 20) ]) === true
```
