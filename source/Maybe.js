/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'idf', 'is', 'compose', 'compose2', 'filter', 'map', 'List', 'singleton', 'emptyList',
  function (idf, is, compose, compose2, filter, map, List, singleton, emptyList) {

  function isJust(thing) {
    return thing !== null && thing !== undefined;
  }

  return {

    maybe: function (def, fun, value) {
      if (value === null || value === undefined) {
        return def;
      }
      return fun(value);
    },

    isJust: isJust,

    isNothing: function (thing) {
      return !isJust(thing);
    },

    fromMaybe: function (def, maybe) {
      if (isJust(maybe)) {
        return maybe;
      }
      return def;
    },

    listToMaybe: function (xs) {
      if (is(List, xs)) {
        return xs.isEmpty() ? null : xs.head();
      }
      throw new TypeError();
    },

    maybeToList: function (thing) {
      if (isJust(thing)) {
        return singleton(thing);
      }
      return emptyList();
    },

    catMaybes: filter(isJust),

    mapMaybe: compose2(filter(isJust), map)
      
  };
  
}];
