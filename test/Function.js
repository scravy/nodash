require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('Function', function () {

    it('idf', function () {
        assert.strictEqual(3, idf(3)());
    });

    it('const', function () {
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
});

