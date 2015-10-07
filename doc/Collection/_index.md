Nodash knows four different types of collections:

- Array
- String
- List
- Stream

Those are typically distinguished as belonging to either Array-like or List-like.
A JavaScript String is an Array-like type, a Stream is a List-like type. `Array`
and `Strings` are the native types from JavaScript, [List](#f-List) and
[Stream](#f-Stream) are introduced by Nodash.

Properties of the various type, where `x` is a value of the given type,
`i` is an index, and `n` is the number of elements.

|               | Array       | String      | List        | Stream      |
| ------------- | ----------- | ----------- | ----------- | ----------- |
| evaluation    | strict      | strict      | lazy        | lazy        |
| mutability    | mutable     | immutable   | immutable   | immutable   |
| typeOf(x)     | `array`     | `string`    | `list`      | `stream`    |
| elements      | arbitrary   | characters  | arbitrary   | arbitrary   |
| limit         | finite      | finite      | finite      | infinite    |
| at(i, x)      | O(1)        | O(1)        | O(n)        | O(n)        |
