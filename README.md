nodash
======

[![Build Status](https://travis-ci.org/scravy/nodash.svg?branch=master)](https://travis-ci.org/scravy/nodash)

A port of the Haskell Prelude to JavaScript/NodeJS.

    npm install --save nodash

Usage:

```JavaScript
// install it globally
require('nodash').install(GLOBAL);

var reverse = foldl(flip(cons), []);

// have it in a variable P
var P = require('nodash');

var reverse = P.foldl(P.flip(P.cons), []);

// have it in a variable Prelude
var Prelude = require('nodash');

var reverse = Prelude.foldl(Prelude.flip(Prelude.cons), []);

// I think you get my drift.
```

What does it do?
----------------

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

Browse through the [tests](tree/master/tests) and the [wiki](wiki/) for examples.

License
-------

    Copyright (c) 2015 Julian Fleischer

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or
    sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
