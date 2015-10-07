/* vim: set et sw=2 ts=2: */

describe('eq', function () {
  'use strict';

  var assert = require('../../util/assert.js');
  var Nodash = require('../../nodash');

  var eq = Nodash.eq;

  it('distinguishes objects with different constructors', function () {

    function User() {}

    function Person() {}

    assert(!eq(new User(), new Person()));
  });

});

