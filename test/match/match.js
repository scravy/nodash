/* vim: set et sw=2 ts=2: */

describe('match', function () {
  'use strict';

  var assert = require('../../util/assert');
  var Nodash = require('../../nodash');

  var match = Nodash.match;

  it('should match a string', function () {
    assert.strictEqual(13, match([
      [ 'nay', 11 ],
      [ 'yepp', 13 ]
    ], 'yepp'));
  });

  it('should match null', function () {
    assert.strictEqual(11, match([
      [ null, 11 ],
      [ 9, 13 ]
    ], null));
  });

  it('should match undefined', function () {
    assert.strictEqual(11, match([
      [ undefined, 11 ],
      [ 9, 13 ]
    ], undefined));
  });

  it('should match a number', function () {
    assert.strictEqual(13, match([
      [ 7, 11 ],
      [ 9, 13 ]
    ], 9));
  });

  it('should match NaN', function () {
    assert.strictEqual(11, match([
      [ NaN, 11 ],
      [ 9, 13 ]
    ], NaN));
  });

  it('should match an object', function () {
    assert.strictEqual(17, match([
      [ { firstName: 'Julian' }, 13 ],
      [ { firstName: 'Alexander' }, 17 ]
    ], { firstName: 'Alexander', lastName: 'Carnicero' }));
  });

  it('should match an object in default case', function () {
    assert.strictEqual(19, match([
      [ { firstName: 'Julian' }, 13 ],
      [ { firstName: 'Alexander' }, 17 ],
      [ '$otherwise', 19 ]
    ], { firstName: 'Wayne' }));
  });

  it('should match an object and capture a variable', function () {
    assert.strictEqual('Carnicero', match([
      [ { firstName: 'Julian' }, 'Walther' ],
      [ { firstName: 'Alexander', lastName: '$lastName' }, function (result) { return result.$lastName; } ]
    ], { firstName: 'Alexander', lastName: 'Carnicero' }));
  });

  it('should match an object with an escaped variable', function () {
    assert.strictEqual('Walther', match([
      [ { firstName: 'Julian', lastName: '$$yea' }, 'Walther' ],
      [ { firstName: 'Alexander', lastName: '$lastName' }, function (result) { return result.$lastName; } ]
    ], { firstName: 'Julian', lastName: '$yea' }));
  });


});
