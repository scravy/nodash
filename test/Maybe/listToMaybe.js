/* vim: set et sw=2 ts=2: */

describe('listToMaybe', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var listToMaybe = Nodash.listToMaybe;

  it('listToMaybe(null) throws', function () {
    assert.throws(function () {
      listToMaybe(null);
    });
  });

});
