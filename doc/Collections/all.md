`(a → Bool) → [a] → Bool`

Applied to a predicate and a list, `all` determines if all
elements of the list satisfy the given predicate.

Example:

```JavaScript
all(even, [1, 2, 3]) === false
all(lte(3), [1, 2, 3]) === true
```

This function works with strings too:

```JavaScript
all(isDigit, "123") === true
```
