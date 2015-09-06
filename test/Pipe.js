require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Pipe', function () {

    it('pipe', function () {
        var result = pipe(
            idf(7),
            plus(3),
            times(10)
        );
        assert.strictEqual(100, result);
    });

    it('pipe /w initial value', function () {
        var result = pipe(
            7,
            plus(3),
            times(10)
        );
        assert.strictEqual(100, result);
    });

    it('pipe /w array', function () {
        var result = pipe([
            idf(7),
            plus(3),
            times(10)
        ]);
        assert.strictEqual(100, result);
    });

    it('pipe /w array + initial value', function () {
        var result = pipe([
            7,
            plus(3),
            times(10)
        ]);
        assert.strictEqual(100, result);
    });

    it('empty pipe', function () {
        assert.strictEqual(undefined, pipe());
    });

    it('pipe /w callback does not throw', function () {
        var error = null;
        pipe([
            7,
            function (x) {
                throw "damn it";
            }
        ], function (err) {
            error = err;
        });
        assert.strictEqual(false, error === null);
    });
});

