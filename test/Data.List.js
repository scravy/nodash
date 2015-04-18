var P = require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('Data.List', function () {

    it('heads', function () {

    });

    it('heads /w string', function () {

    });

    it('tails', function () {

    });

    it('tails /w string', function () {

    });

    it('inits', function () {

    });

    it('inits /w string', function () {

    });

    it('lasts', function () {

    });

    it('lasts /w string', function () {

    });

    it('partition', function () {
        assert.deepEqual(
            [ [ 0, -3, -3, -10 ], [ 4, 5, 14 ] ],
            partition(gte(0), [ 0, -3, 4, 5, -3, -10, 14 ])
        );
    });

    it('partition /w string', function () {
        assert.deepEqual(
            [ " ", "HelloWorld!" ],
            partition(function isSpace(chr) {
                return chr === ' ';
            }, "Hello World!")
        );
    });

    it('transpose', function () {
        assert.deepEqual(
            [ ['a', 'd', 'f'], ['b', 'e', 'g'], ['c', 'h'], ['i'] ],
            transpose([ ['a', 'b', 'c'], ['d', 'e'], ['f', 'g', 'h', 'i' ] ])
        );
    });

    it('transpose /w string', function () {
        assert.deepEqual(
            [ "adf", "beg", "ch", "i" ],
            transpose([ "abc", "de", "fghi" ])
        );
    });

    it('group', function () {
        assert.deepEqual(
            [ ['H'], ['e'], ['l', 'l'], ['o'], [' '],
              ['W'], ['o'], ['r'], ['l'], ['d'], ['!']],
            group(['H', 'e', 'l' ,'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd', '!'])
        );
        assert.deepEqual([], groupBy(neq, []));
    });

    it('group /w string', function () {
        assert.deepEqual(
            [ "H", "e", "ll", "o", " ", "W", "o", "r", "l", "d", "!" ],
            group("Hello World!")
        );
        assert.deepEqual([], groupBy(neq, []));
    });

    it('maximumBy', function () {
        var list = [2, 10, 5, 8, 21, 1, 9, 8, 3];
        assert.strictEqual(minimum(list), maximumBy(function (a, b) {
            return -compare(a, b);
        }, list));
    });

    it('minimumBy', function () {
        var list = [2, 10, 5, 8, 21, 1, 9, 8, 3];
        assert.strictEqual(maximum(list), minimumBy(function (a, b) {
            return -compare(a, b);
        }, list));
    });
});

