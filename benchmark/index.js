/* vim: set et sw=2 ts=2: */

"use strict";

var benchmark = require('./benchmark.js');
var underscore = require('underscore');
var nodash = require('../nodash.js');
var lodash = require('lodash');

function plus1(x) { return x + 1; }

benchmark.timeSuite({
  iterations: 100000,
  delay: 1,
  median: true
}, {

  map: {

    0: function () { return [ 1, 1, 2, 3, 5, 8, 13 ]; },
    1: function () { return function (x) { return x + 1; }; },

    'underscore': function (xs, plus1) {
      underscore.map(xs, plus1);
    },

    'underscore (curried)': function (xs) {
      underscore.map(xs, nodash.plus(1));
    },

    'lodash': function (xs, plus1) {
      lodash.map(xs, plus1);
    },

    'lodash (curried)': function (xs) {
      lodash.map(xs, nodash.plus(1));
    },

    'nodash': function (xs, plus1) {
      nodash.map(plus1, xs);
    },

    'nodash (curried)': nodash.map(nodash.plus(1))
  }

}, function (results) {
  benchmark.printResults(results);
});

