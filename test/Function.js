require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('Function', function () {

    it('const', function () {
        //FIXME: This will not work due to the nature of function application
        //assert.strictEqual(4, foldl(constant(plus(1)), 0, [1,4,3,2]));
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

