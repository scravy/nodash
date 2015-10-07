/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = {

  lines: function (string) {
    var result = string.split(/\n/);
    if (result[result.length - 1].length === 0) {
      delete result[result.length - 1];
    }
    return result;
  },

  unlines: function (lines) {
    return lines.join('\n');
  },

  words: function (string) {
    return string.split(/[\n\r\v\t ]/);
  },

  unwords: function (words) {
    return words.join(' ');
  }

};
