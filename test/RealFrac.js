require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('RealFrac', function () {

    it('properFraction', function () {
        var x = properFraction( 8.5 );
        var y = properFraction( -8.5 );
        assert(eq(tuple(8, 0.5), x));
        assert(eq(tuple(-8, -0.5), y));
    });

    it('truncate', function () {
        assert.strictEqual(0, truncate(0.5));
        assert.strictEqual(0, truncate(-0.5));
        assert.strictEqual(0, truncate(-0));
    });

    it('round', function () {
        assert.strictEqual(8, round(8.5));
        assert.strictEqual(-8, round(-8.5));
        assert.strictEqual(8, round(8.4));
        assert.strictEqual(-8, round(-8.4));
        assert.strictEqual(9, round(8.6));
        assert.strictEqual(-9, round(-8.6));
        assert.strictEqual(10, round(9.5));
        assert.strictEqual(-10, round(-9.5));
        assert.strictEqual(0, round(0.5));
        assert.strictEqual(0, round(-0.5));
    });
});

