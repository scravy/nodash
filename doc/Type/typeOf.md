`Something → String`

Returns the type of the given thing as a String.

This differs from JavaScripts `typeof` in the way that it
distinguishes `null`, `object`, and `array` and identifies
`NaN` as `not-a-number` (`Infinity` and `-Infinity` are both
reported as `number`). Also it knows some types native to
nodash, such as `list`, `stream`, and `tuple`.

The possible return values are:

- `boolean` for `true` and `false`,
- `number` for a number which is not `NaN`,
- `string` for a JavaScript string,
- `function` for a JavaScript function,
- `not-a-number` if `isNaN` would return true,
- `null` for `null`,
- `undefined` for `undefined`,
- `array` is `Array.isArray` would return true,
- `list` if it is a [List](#f-List),
- `stream` if it is a [Stream](#f-Stream),
- `tuple` if it is a [Tuple](#f-Tuple),
- `object` if it is an object but neither `null` nor an `array`
  or any of the previously mentioned object types (e.g. `tuple`)

In ECMAScript 2015 (ES6) this function may also return `symbol`
for Symbols.
