`MatchSpec → Any → MatchResult`

`match(spec, value)` matches `value` against the `spec`, returning
what was captured in the spec.

A `MatchSpec` is an array of arrays. Every array in the spec
must have two elements: `[ 0: Pattern, 1: Result ]`. The first
`Pattern` that matches `value` will yield the associated `Result`.
If `Result` is a function it will be invoked with an object of
all captured variables in the `Pattern` and the result will be returned,
otherwise the `Result` itself.
