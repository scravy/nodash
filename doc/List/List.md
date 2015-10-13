`new List(head, tail) :: a → [a] → [a]`

Lists are immutable singly-linked sequences.

Methods:

<dl>
    <dt>.head() → a</dt>
    <dd>Extract the first element in the list.</dd>

    <dt>.tail() → List a</dt>
    <dd>Extract the rest of the list.</dd>
</dl>

Lists are typically not constructed by user code with this
constructor, but with builers such as [arrayToList](#f-lazy).

The purpose of the List type is to implement lazy evaluation.
Internally the head and the tail of a list may actually be Thunks
which are evaluated only if you call `.head()` or `.tail()` respectively.

To construct lazy lists, use [lazy](#f-lazy).

Example:

```JavaScript
var xs = new List(38, new List(42, emptyList()))

console.log(xs.head()) // 38
console.log(xs.tail().head()) // 42
```

`head` and `tail` are functional forms of `.head()` and `.tail()`.

```JavaScript
var xs = lazy([1, 2, 3, 4, 5]);
console.log(head(xs)); // 1
console.log(head(tail(xs))); // 2
```
