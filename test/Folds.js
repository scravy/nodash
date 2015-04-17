require('../prelude')(GLOBAL);
var assert = require('assert');

describe('Folds', function () {

    it('foldl1', function () {
        assert.equal(7, foldl1(max, [1, 4, 3, 2, 5, 7, 4, 3, 6]));
    });

    it('foldr1', function () {
        assert.equal(7, foldr1(max, [1, 4, 3, 2, 5, 7, 4, 3, 6]));
    });

    it('maximum', function () {
        assert.equal(7, maximum([1, 4, 3, 2, 5, 7, 4, 3, 6]));
    });

    it('minimum', function () {
        assert.equal(2, minimum([10, 4, 3, 2, 5, 7, 4, 3, 6]));
    });

});
