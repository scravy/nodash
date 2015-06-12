var P = require('../nodash').install(GLOBAL);
var assert = map(flip, require('assert'));

describe('Integral', function () {

    it('div', function () {
        assert.strictEqual(1, div(9, 8));
        assert.strictEqual(-2, div(-9, 8));
        assert.strictEqual(-2, div(9, -8));
        assert.strictEqual(1, div(-9, -8));
    });

    it('mod', function () {
        assert.strictEqual(1, mod(9, 8));
        assert.strictEqual(7, mod(-9, 8));
        assert.strictEqual(-7, mod(9, -8));
        assert.strictEqual(-1, mod(-9, -8));
    });

    it('divMod', function () {
        assert.deepEqual([1,1], divMod(9, 8));
        assert.deepEqual([-2,7], divMod(-9, 8));
        assert.deepEqual([-2,-7], divMod(9, -8));
        assert.deepEqual([1,-1], divMod(-9, -8));
    });

    it('quot', function () {
        assert.strictEqual(1, quot(9, 8));
        assert.strictEqual(-1, quot(-9, 8));
        assert.strictEqual(-1, quot(9, -8));
        assert.strictEqual(1, quot(-9, -8));
    });

    it('rem', function () {
        assert.strictEqual(1, rem(9, 8));
        assert.strictEqual(-1, rem(-9, 8));
        assert.strictEqual(1, rem(9, -8));
        assert.strictEqual(-1, rem(-9, -8));
    });

    it('quotRem', function () {
        assert.deepEqual([1,1], quotRem(9, 8));
        assert.deepEqual([-1,-1], quotRem(-9, 8));
        assert.deepEqual([-1,1], quotRem(9, -8));
        assert.deepEqual([1,-1], quotRem(-9, -8));
    });


});

