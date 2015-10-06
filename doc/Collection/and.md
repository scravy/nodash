`[Bool] → Bool`

Returns the conjunction of a list of booleans, i.e. it returns
`true` iff all the elements in the list evaluate to `true`.

*NOTE:* This, the lowercase `and`, is not the binary boolean operator, which
is the uppercase [`AND`](#f-AND).

Example:

```JavaScript
and([true, true, true]) === true
and([true, false, true]) === false
and([1, 1, 1]) === true
and([]) === false
```
