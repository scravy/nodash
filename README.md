nodash
======

[![Build Status](https://travis-ci.org/scravy/nodash.svg?branch=master)](https://travis-ci.org/scravy/nodash)
[![Dependencies](https://david-dm.org/scravy/nodash.svg)](https://david-dm.org/scravy/nodash#info=dependencies&view=table)
[![Dependencies](https://david-dm.org/scravy/nodash/dev-status.svg)](https://david-dm.org/scravy/nodash#info=devDependencies&view=table)


***nodash*** offers you a rich set of library functions, comparable to
the likes of [***underscore***](http://underscorejs.org/)
or [***lodash***](https://lodash.com/).
The functions are actually derived
from the [***Haskell Prelude***](https://hackage.haskell.org/package/base-4.7.0.0/docs/Prelude.html)
and emphasize a [functional programming style](https://www.cs.cmu.edu/~crary/819-f09/Backus78.pdf).

A special trait of this library is that it discards some JavaScript concepts
(like prototypes or optional arguments) to allow some (in the authors opinion)
more useful ones (such as currying).

Every function from this library can be thought of as *curried*, i.e. you can
partially apply any function and get a function in return (on the other hand this
means there are no optional arguments). It also supports *lists* which can be
evaluated lazily and *infinite streams*.

Browse through the
 [apidoc](https://scravy.github.io/nodash/apidoc.html),
 [benchmark](https://github.com/scravy/nodash/tree/master/benchmark/index.js), or
 [tests](https://github.com/scravy/nodash/tree/master/test) for examples.

For a list of which prelude functions are covered see the
[apidoc appendix](http://scravy.github.io/nodash/apidoc.html#Appendix).

Nodash is available via [npm](https://www.npmjs.com/package/nodash).


Example
-------

```JavaScript
Nodash.install(global || window); // node or browser

var reverse = foldl(flip(cons), []);

console.log(reverse([1,2,3])); // → [3,2,1]
```


Usage
-----

### in node

```
npm install --save nodash
```

```JavaScript
var Nodash = require('nodash');
```


### in the browser

```HTML
<script src="nodash.js"></script>
<script>
    // Nodash is available in `window.Nodash`
    document.write(Nodash.foldl(Nodash.flip(cons), []));
</script>
```


### in legacy browsers

Just pull in `es5-shim` first:

```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.1.13/es5-shim.js"></script>
<script src="nodash.js"></script>
```


### `install(mountpoint)`

It is possible to attach the Nodash functions directly
to the global object (in fact, any object), optionally
with a prefix or postfix:

```JavaScript
Nodash.install(global);           → foldl(flip(cons), []);
Nodash.install([ '$', global ]);  → $foldl($flip($cons), []);
Nodash.install([ global, '_' ]);  → foldl_(flip_(cons_), []);
Nodash.install([ 'f_', global ]); → f_foldl(f_flip(f_cons), []);
```

Both a prefix and a postfix works too:

```JavaScript
Nodash.install([ '__', global, '__' ]); → __foldl__(__flip__(__cons__), []);
```


License
-------

    Copyright (c) 2015 Julian Alexander Fleischer

    Permission is hereby granted, free of charge, to any
    person obtaining a copy of this software and associated
    documentation files (the "Software"), to deal in the
    Software without restriction, including without
    limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software
    is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice
    shall be included in all copies or substantial portions
    of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
    PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
    CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.

