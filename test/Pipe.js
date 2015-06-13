var P = require('../nodash').install(GLOBAL);
var assert = map(flip, require('assert'));

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
});

