`Function ... → Function ...`

Creates a partially applicable function from an ordinary function. This is at the
heart of Nodash's spectrum of features: Every Nodash function is curried using
this function.

This function reads the arguments `length` property to determine how many
arguments the function takes and turns it into a curried version accordingly.
The curried version is *magic* in a way: It can be used both curried as well as
uncurried.

Typical function application in JavaScript looks like this: `f(1, 2, 3)`. A curried
variant of this function would accept only one argument and return a function instead
such that function application would look like this: `f(1)(2)(3)`. A function which
is curried using `curried` can be invoked either way: `f(1, 2, 3)`, `f(1)(2, 3)`,
`f(1, 2)(3)`, and `f(1)(2)(3)` are all possible. This is extremely useful to create
functions from partial applications: `plus(1)` is a function that increments its argument
by one.