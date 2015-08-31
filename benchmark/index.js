/* vim: set et sw=2 ts=2: */

"use strict";

var benchmark = require('./benchmark.js');
var underscore = require('underscore');
var nodash = require('../nodash.js');
var lodash = require('lodash');

function arrayMap1(f, xs) {
  var length = xs.length;
  var ys = new Array(length);
  var i = 0;
  while (++i < length) {
    ys[i] = f(xs[i]);
  }
  return ys;
}

function arrayMap2(f, xs) {
  var length = xs.length;
  var ys = new Array(length);
  for (var i = 0; i < length; i += 1) {
    ys[i] = f(xs[i]);
  }
  return ys;
}

function arrayMap3(f, xs) {
  var length = xs.length;
  var ys = [];
  for (var i = 0; i < length; i += 1) {
    ys.push(f(xs[i]));
  }
  return ys;
}

function plus1(x) { return x + 1; }

benchmark.timeSuite({
  iterations: 10000,
  delay: 0,
  median: true
}, {

  something: idf(3),

  group: {
    something: idf(5),
    anything: function () { throw "Exception while executing"; }
  },

  map: {

    0: function () { return [ 1, 1, 2, 3, 5, 8, 13 ]; },

  /*
    arrayMapWhile: function (xs) {
      arrayMap1(plus1, xs);
    },

    arrayMapLoop: function (xs) {
      arrayMap2(plus1, xs);
    },

    arrayMapPush: function (xs) {
      arrayMap3(plus1, xs);
    },
  */

    underscore: function (xs) {
      underscore.map(xs, plus1);
    },

    lodash: function (xs) {
      lodash.map(xs, plus1);
    },

    nodash: function (xs) {
      nodash.map(plus1, xs);
    },

    nodashCurried: nodash.map(plus1)
  }

}, function (results) {
  benchmark.printResults(results);
});

