var P = require('../nodash');
var assert = require('assert');

describe('Ord', function () {

    it('lt', function () {
        assert.strictEqual(true, P.lt(10, 12));
        assert.strictEqual(false, P.flip(P.LT)(10, 12));
    });

    it('gt', function () {
        assert.strictEqual(true, P.gt(10, -12));
        assert.strictEqual(false, P.flip(P.GT)(10, -12));
    });

    it('lte', function () {
        assert.strictEqual(true, P.lte(10, 10));
        assert.strictEqual(true, P.LTE(10, +Infinity));
        assert.strictEqual(false, P.flip(P.LTE)(10, +Infinity));
    });

    it('gte', function () {
        assert.strictEqual(true, P.gte(10, 10));
        assert.strictEqual(true, P.GTE(10, -Infinity));
        assert.strictEqual(false, P.flip(P.GTE)(10, -Infinity));
    });

    it('compare', function () {
        assert.strictEqual(0, P.compare(20, 20));
        assert.strictEqual(-1, P.compare(-20, 20));
        assert.strictEqual(+1, P.compare(20, -20));
    });

    it('compare on function should yield undefined', function () {
        assert.strictEqual(undefined, P.compare(id, id));
    });

    it('comparing', function () {
        assert.strictEqual(0, P.comparing(P.negate, 20, 20));
        assert.strictEqual(+1, P.comparing(P.negate, -20, 20));
        assert.strictEqual(-1, P.comparing(P.negate, 20, -20));
    });
});

