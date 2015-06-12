var P = require('../nodash');
var assert = require('assert');

describe('Num', function () {

    it('add', function () {
        assert.strictEqual(10, P.plus(4, 6));
        assert.strictEqual(10, P.add(6, 4));
    });

    it('sub', function () {
        assert.strictEqual(-2, P.minus(4, 6));
        assert.strictEqual(2, P.sub(6, 4));
    });

    it('mul', function () {
        assert.strictEqual(24, P.times(4, 6));
        assert.strictEqual(24, P.mul(6, 4));
    });

    it('negate', function () {
        assert.strictEqual(-4, P.negate(4));
        assert.strictEqual(6, P.negate(-6));
    });

});

