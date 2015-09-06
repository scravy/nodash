require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Numeric', function () {

    it('gcd', function () {
        assert.strictEqual(1, gcd(10, 17));
        assert.strictEqual(3, gcd(27, 39));
    });

    it('lcm', function () {
        assert.strictEqual(0, lcm(0, 0));
        assert.strictEqual(837, lcm(27, 93));
    });

    it('even', function () {
        assert.strictEqual(true, even(0));
        assert.strictEqual(false, even(1));
        assert.strictEqual(false, even(-1));
        assert.strictEqual(true, even(2));
        assert.strictEqual(true, even(-2));
    });

    it('odd', function () {
        assert.strictEqual(false, odd(0));
        assert.strictEqual(true, odd(1));
        assert.strictEqual(true, odd(-1));
        assert.strictEqual(false, odd(2));
        assert.strictEqual(false, odd(-2));
    });

});

