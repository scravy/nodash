nodash
======

[![Build Status](https://travis-ci.org/scravy/nodash.svg?branch=master)](https://travis-ci.org/scravy/nodash)

***nodash*** offers you a rich set of library functions, comparable to
the likes of [***underscore***](http://underscorejs.org/)
or [***lodash***](https://lodash.com/).
The functions are actually derived
from the [***Haskell Prelude***](https://hackage.haskell.org/package/base-4.7.0.0/docs/Prelude.html)
and emphasize a functional programming style.

A special
trait of this library is that it discards some JavaScript concepts (like
`this`) to allow some (in the authors opinion) more useful ones. Every function
from this library can be thought of as *curried*, i.e. you can partially apply
any function and get a function in return (on the other hand this means there are
no optional arguments). Also you have a distinction between *lists* and *streams*
and it can cope with *infinite streams*.

Browse through the [tests](https://github.com/scravy/nodash/tree/master/test) for examples.


Usage
-----

A port of the Haskell Prelude to JavaScript/NodeJS.

    npm install --save nodash

Usage in Node, installed in `GLOBAL`:

```JavaScript
require('nodash').install(GLOBAL);

var reverse = foldl(flip(cons), []);
```

Usage in Node, installed in `GLOBAL` but prefixed:

```JavaScript
require('nodash').install([ '$', GLOBAL ]);

var reverse = $foldl($flip($cons), []);
```

Usage in Node, installed in `GLOBAL` but prefixed + postfixed:

```JavaScript
require('nodash').install([ '__', GLOBAL, '__' ]);

var reverse = __foldl__(__flip__(__cons__), []);
```

Usage in Node:

```JavaScript
var P = require('nodash');

var reverse = P.foldl(P.flip(P.cons), []);
```

Usage in the browser:

```JavaScript
<script src="nodash.js"></script>
<script>
// nodash is available in window.Nodash
var reverse = Nodash.foldl(Nodash.flip(Nodash.cons), []);

// you can use `Nodash.install()` like you would in node
Nodash.install(window);

var reverse2 = foldl(flip(cons, []));

// also with prefix/postfix (a postfix only in the line below)
Nodash.install([ window, '_' ]);

var reverse3 = foldl_(flip_(cons_, []));
```

License
-------

    Copyright (c) 2015 Julian Fleischer

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

