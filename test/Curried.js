require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Curried', function () {

    it("curried #4", function () {
        var f = curried(function (a, b, c, d) {
            return a + b + c + d;
        });
        assert.strictEqual(10, f(1)(2)(3)(4));
        assert.strictEqual(10, f(1)(2, 3)(4));
        assert.strictEqual(10, f(1)(2)(3, 4));
        assert.strictEqual(10, f(1)(2, 3, 4));
        assert.strictEqual(10, f(1, 2)(3, 4));
        assert.strictEqual(10, f(1, 2)(3)(4));
        assert.strictEqual(10, f(1, 2, 3)(4));
        assert.strictEqual(10, f(1, 2, 3, 4));
    });

    it("curried #5", function () {
        var f = curried(function (a, b, c, d, e) {
            return a + b + c + d + e;
        });
        assert.strictEqual(15, f(1)(2)(3)(4)(5));
        assert.strictEqual(15, f(1, 2)(3)(4)(5));
        assert.strictEqual(15, f(1)(2, 3)(4)(5));
        assert.strictEqual(15, f(1)(2)(3, 4)(5));
        assert.strictEqual(15, f(1)(2)(3)(4, 5));
        assert.strictEqual(15, f(1, 2)(3, 4)(5));
        assert.strictEqual(15, f(1, 2)(3)(4, 5));
        assert.strictEqual(15, f(1, 2)(3, 4, 5));
        assert.strictEqual(15, f(1, 2, 3)(4, 5));
        assert.strictEqual(15, f(1, 2, 3)(4)(5));
        assert.strictEqual(15, f(1, 2, 3, 4)(5));
        assert.strictEqual(15, f(1, 2, 3, 4, 5));
    });


    it("curried #6", function () {
        var f = curried(function (a, b, c, d, e, f) {
            return a + b + c + d + e + f;
        });
        assert.strictEqual(21, f(1)(2)(3)(4)(5)(6));
        assert.strictEqual(21, f(1, 2)(3)(4)(5)(6));
        assert.strictEqual(21, f(1, 2, 3)(4)(5)(6));
        assert.strictEqual(21, f(1, 2, 3, 4)(5)(6));
        assert.strictEqual(21, f(1, 2, 3, 4, 5)(6));
        assert.strictEqual(21, f(1, 2, 3, 4, 5, 6));
    });

});
