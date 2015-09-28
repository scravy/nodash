/* vim: set et sw=2 ts=2: */

// `indexOf` is an implementation of the Knuth-Morrison-Pratt
// Algorithm for finding the index of a given subsequence
// (identified as `word` here) within a sequence (identified as
// `string` here). Thanks to JavaScript's dynamic nature it
// works equally well with strings and arrays.
function indexOf(word, string) {
  var m = 0;
  var i = 0;
  var table = [];

  var pos = 2;
  var cnd = 0;

  table[0] = -1;
  table[1] = 0;

  // build the table for KMP. This takes `O(word.length)` steps.
  while (pos < word.length) {
    if (word[pos - 1] == word[cnd]) {
      cnd = cnd + 1;
      table[pos] = cnd;
      pos = pos + 1;
    } else if (cnd > 0) {
      cnd = table[cnd];
    } else {
      table[pos] = 0;
      pos = pos + 1;
    }
  }
}

module.exports = indexOf;
