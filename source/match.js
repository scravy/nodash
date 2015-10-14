/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function () {

  function matchString(pattern, arg, result) {
    if (pattern[0] === '$') {
      if (pattern[1] === '$') {
        pattern = pattern.slice(1);
      } else {
        result[pattern] = arg;
        return true;
      }
    }
    return pattern === arg;
  }

  function matchObject(pattern, arg, result) {
    if (pattern === null || arg === null || arg === undefined) {
      return pattern === arg;
    }
    var keys = Object.keys(pattern);
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (!matchR(pattern[key], arg[key], result)) {
        return false;
      }
    }
    return true;
  }

  function matchR(pattern, arg, result) {
    var patternType = typeof pattern;
    var argType = typeof arg;

    switch (patternType) {
      case 'string':
        return matchString(pattern, arg, result);
      case 'object':
        return matchObject(pattern, arg, result);
      case 'number':
        if (isNaN(pattern) && isNaN(arg)) {
          return true;
        }
        /* falls through */
      default:
        return pattern === arg;
    }
  }

  return {
    match: function (pattern, arg) {
      var argType = typeof arg;
      for (var i = 0; i < pattern.length; i += 1) {
        var result = {};
        var p = pattern[i];
        if (matchR(p[0], arg, result)) {
          if (typeof p[1] === 'function') {
            return p[1](result);
          }
          return p[1];
        }
      }
    }
  };

};
