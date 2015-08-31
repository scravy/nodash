/* vim: set et sw=2 ts=2: */
/* jshint node: true */
/* global map */
"use strict";

var benchmark = require('./benchmark.js');
var underscore = require('underscore');
var nodash = require('../nodash.js');
var lodash = require('lodash');

benchmark.timeSuite({
  iterations: 100000,
  delay: 2,
  median: true
}, {

  'map': {

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
  },

  'map (alternatives)': {

    0: function () { return nodash.plus(1); },
    1: function () { return [ 1, 1, 2, 3, 5, 8, 13 ]; },

    'for loop': function (f, xs) {
      var length = xs.length;
      var result = new Array(length);
      for (var i = 0; i < length; i += 1) {
        result[i] = f(xs[i]);
      }
      return result;
    },

    'while loop': function (f, xs) {
      var length = xs.length;
      var result = new Array(length);
      var i = 0;
      while (++i < length) {
        result[i] = f(xs[i]);
      }
      return result;
    },

    'array push': function (f, xs) {
      var result = [];
      for (var i = 0; i < xs.length; i += 1) {
        result.push(f(xs[i]));
      }
      return result;
    },
    
    'array push + while': function (f, xs) {
      var result = [];
      var length = xs.length;
      var i = 0;
      while (++i < length) {
        result.push(f(xs[i]));
      }
      return result;
    }


  }

}, function (results) {
  benchmark.printResults(results);
});

