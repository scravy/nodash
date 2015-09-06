require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Floating', function () {

    it('logBase', function () {
        for (var i = 2; i <= 10; i++) {
            assert.strictEqual(1, logBase(i, i));
        }
        assert.deepEqual(replicate(4, 1), zipWith(logBase, [2,3,4,5], [2,3,4,5]));
    });

    it('sinh', function () {
        assert.strictEqual(0, sinh(0));
        assert.strictEqual(-Infinity, sinh(-Infinity));
        assert.strictEqual(Infinity, sinh(Infinity));
    });

    it('cosh', function () {
        assert.strictEqual(1, cosh(0));
    });

    it('tanh', function () {
        assert.strictEqual(1, tanh(Infinity));
        assert.strictEqual(-1, tanh(-Infinity));
        assert.strictEqual(0, tanh(0));
    });

    it('asinh', function () {
        assert.strictEqual(0, asinh(0));
        assert.strictEqual(-Infinity, asinh(-Infinity));
        assert.strictEqual(Infinity, asinh(Infinity));
    });

    it('acosh', function () {
        assert.strictEqual(0, acosh(1));
    });

    it('atanh', function () {
        assert.strictEqual(Infinity, atanh(1));
        assert.strictEqual(-Infinity, atanh(-1));
        assert.strictEqual(0, atanh(0));
    });
});

