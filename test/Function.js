require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('RealFrac', function () {

    it('const', function () {
        
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

