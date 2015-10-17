`Any → String`

Determines the property of the internal
[`[[Class]]`](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6.2) attribute,
normalized to lower case.

Example:

```Javascript
classOf(new Date()) === 'date'
classOf(null) === 'null'
classOf([]) === 'array'

function f() {
    return classOf(arguments)
}
f() === 'arguments'
```
