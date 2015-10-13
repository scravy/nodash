require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

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
        assert(eq(tuple(1, 1), divMod(9, 8)));
        assert(eq(tuple(-2, 7), divMod(-9, 8)));
        assert(eq(tuple(-2, -7), divMod(9, -8)));
        assert(eq(tuple(1, -1), divMod(-9, -8)));
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
        assert(eq(tuple(1, 1), quotRem(9, 8)));
        assert(eq(tuple(-1, -1), quotRem(-9, 8)));
        assert(eq(tuple(-1, 1), quotRem(9, -8)));
        assert(eq(tuple(1, -1), quotRem(-9, -8)));
    });


});

