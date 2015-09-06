require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Function', function () {

    it('idf', function () {
        assert.strictEqual(3, idf(3)());
    });

    it('const', function () {
        // TODO
        //assert.strictEqual(4, foldl(compose(constant, plus(1)), 0, [1,9,37,0]));
    });

    it('apply', function () {
        assert.deepEqual(
            zipWith(
                apply,
                [ plus(10), times(10), flip(minus)(10) ],
                [ 10, 20, 30 ]
            ), [ 20, 200, 20 ]);
    });

    it('compose', function () {
        assert.strictEqual(210, compose(plus(10), times(10))(20));
        assert.strictEqual(300, compose(times(10), plus(10))(20));
    });

    it('invoke', function () {
        var value = Math.random();
        assert.strictEqual(value, invoke(idf(value)));
    });

    it('curry', function () {
        var f = curry(function (x) { return fst(x) + snd(x); });
        assert.strictEqual(
            true,
            eq(zipWith(f, [ 1, 2, 3 ], [ 3, 2, 1 ]), [ 4, 4, 4 ])
        );
    });

    it('uncurry', function () {
        assert.strictEqual(
            true,
            eq(map(uncurry(Math.min), zip([1, 2, 3], [3, 2, 1])), [1, 2, 1])
        );
    });
});

