require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Num', function () {

    it('plus', function () {
        assert.strictEqual(10, plus(4, 6));
    });

    it('add', function () {
        assert.strictEqual(10, add(6, 4));
    });

    it('minus', function () {
        assert.strictEqual(-2, minus(4, 6));
    });

    it('subtract', function () {
        assert.strictEqual(-2, subtract(6, 4));
    });

    it('mul', function () {
        assert.strictEqual(24, times(4, 6));
        assert.strictEqual(24, mul(6, 4));
    });

    it('negate', function () {
        assert.strictEqual(-4, negate(4));
        assert.strictEqual(6, negate(-6));
    });

});

