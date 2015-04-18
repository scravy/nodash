node-prelude
============

[![Build Status](https://travis-ci.org/scravy/node-prelude.svg?branch=master)](https://travis-ci.org/scravy/node-prelude)

A port of the Haskell Prelude to JavaScript/NodeJS.

    npm install --save node-prelude

Usage:

    // have it in a variable P
    var P = require('node-prelude');

    var reverse = P.foldl(P.flip(P.cons), []);

    // have it in a variable Prelude
    var Prelude = require('node-prelude');

    var reverse = Prelude.foldl(Prelude.flip(Prelude.cons), []);

    // install it globally
    require('node-prelude').install(GLOBAL);

    var reverse = foldl(flip(cons), []);

    // combined
    var P = require('node-prelude').install(GLOBAL);

    var reverse = foldl(flip(P[':']), []);

