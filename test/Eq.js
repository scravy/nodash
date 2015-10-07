require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Eq', function () {

    it('eq', function () {
        assert.strictEqual(true, eq(0, 0));
        assert.strictEqual(true, flip(eq)(0, 0));
        assert.strictEqual(true, eq('hello', 'hello'));
        assert.strictEqual(false, eq('0', 0));
        assert.strictEqual(false, flip(eq)(10, 0));
        assert.strictEqual(false, flip(eq)(0, 10));
    });

    it('eq /w Tuple', function () {
        assert.strictEqual(true, eq(tuple(1, 3), tuple(1, 3)));
        assert.strictEqual(false, eq(tuple(1, 3), tuple(3, 1)));
        assert.strictEqual(true, eq(tuple3(1, 3, 9), tuple3(1, 3, 9)));
        assert.strictEqual(false, eq(tuple3(1, 3, 9), tuple3(3, 1, 9)));
        assert.strictEqual(true, eq(tuple4(1, 3, 9, 27), tuple4(1, 3, 9, 27)));
        assert.strictEqual(false, eq(tuple4(1, 3, 9, 27), tuple4(1, 3, 9, 81)));
    });

    it('eq /w List', function () {
        assert.strictEqual(true, eq(lazy([1, 2, 3]), lazy([1, 2, 3])));
    });

    it('eq /w object', function () {
        assert.strictEqual(true, eq({}, {}));
        assert.strictEqual(true, eq({ a: 7 }, { a: 7 }));
        assert.strictEqual(false, eq({ a: 7 }, {}));
        assert.strictEqual(false, eq(tuple3(1, 2, 3), new Date()));
    });

    it('neq', function () {
        assert.strictEqual(false, neq(0, 0));
        assert.strictEqual(false, flip(neq)(0, 0));
        assert.strictEqual(false, neq('hello', 'hello'));
        assert.strictEqual(true, neq('0', 0));
        assert.strictEqual(true, flip(neq)(10, 0));
        assert.strictEqual(true, flip(neq)(0, 10));
    });

});
