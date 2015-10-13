`new Tuple(first, second) :: a → b → (a, b)`

Tuples are immutable pairs of a first and a second components.

Methods:

<dl>
    <dt>.fst() → a</dt>
    <dd>Retrieves the first component of this tuple.</dd>

    <dt>.snd() → b</dt>
    <dd>Retrieves the second component of this tuple.</dd>
</dl>

Example:

```JavaScript
var t = new Tuple(4711, 8080);
console.log(t.fst()); // 4711
console.log(t.snd()); // 8080
```

`fst` and `snd` are functional forms of `.fst()` and `.snd()`.

`tuple` is a convenience method for omitting `new`:

```JavaScript
var t = tuple(4711, 8080);
console.log(fst(t)); // 4711
console.log(snd(t)); // 8080
var extractFirsts = map(fst);
console.log(extractFirsts([
    tuple(4711, 8080),
    tuple(3000, 4444)
])); // [ 4711, 3000 ]
```
