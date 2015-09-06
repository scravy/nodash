require('../nodash');
var assert = require('../util/assert');

describe('Ord', function () {

    it('lt', function () {
        assert.strictEqual(true, lt(10, 12));
        assert.strictEqual(false, flip(LT)(10, 12));
    });

    it('gt', function () {
        assert.strictEqual(true, gt(10, -12));
        assert.strictEqual(false, flip(GT)(10, -12));
    });

    it('lte', function () {
        assert.strictEqual(true, lte(10, 10));
        assert.strictEqual(true, LTE(10, +Infinity));
        assert.strictEqual(false, flip(LTE)(10, +Infinity));
    });

    it('gte', function () {
        assert.strictEqual(true, gte(10, 10));
        assert.strictEqual(true, GTE(10, -Infinity));
        assert.strictEqual(false, flip(GTE)(10, -Infinity));
    });

    it('compare', function () {
        assert.strictEqual(0, compare(20, 20));
        assert.strictEqual(-1, compare(-20, 20));
        assert.strictEqual(+1, compare(20, -20));
    });

    it('compare on function should yield undefined', function () {
        assert.strictEqual(undefined, compare(id, id));
    });

    it('comparing', function () {
        assert.strictEqual(0, comparing(negate, 20, 20));
        assert.strictEqual(+1, comparing(negate, -20, 20));
        assert.strictEqual(-1, comparing(negate, 20, -20));
    });
});

