/* vim: set et sw=2 ts=2: */

describe('append', function () {
  'use strict';

  var assert = require('../../../util/assert.js');
  var Nodash = require('../../../nodash');

  var append = Nodash.append;

  it('throws if no collection type was passed', function () {
    assert.throws(function () {
      append();
    });
  });
  
});

