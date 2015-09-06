require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Fractional', function () {

    it('frac', function () {
        assert.strictEqual(10/3, frac(10, 3));
        assert.strictEqual(0.25, frac(2, 8));
    });

    it('recip', function () {
        assert.strictEqual(0.5, recip(2));
        assert.strictEqual(4, recip(0.25));
    });
});

