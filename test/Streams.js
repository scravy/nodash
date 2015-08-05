require('../nodash').install(GLOBAL);
var assert = map(flip, require('assert'));

describe('Streams', function () {

    it('consumeString', function () {
        assert.strictEqual("123", consumeString(stream([ 1, 2, 3 ])));
        assert.strictEqual("abc", consumeString(stream("abc")));
        assert.strictEqual("9", consumeString(stream([ 9 ])));
        assert.strictEqual("9", consumeString(9));
    });

    it('consume', function () {
        assert.strictEqual(3, consume(3));
        assert.deepEqual([], consume([]));
        assert.deepEqual([], consume(stream([])));
        assert.deepEqual([ 9, 19 ], consume([ 9, 19 ]));
    });

    it('stream /w function', function () {
        var i = 7;
        assert.deepEqual(
            [ 7, 8, 9 ],
            consume(take(3, stream(function () { return i++; })))
        );
    });

    it('each /w stream', function () {
        var zs = [];
        each(function (x) {
            zs.push(x);
        }, stream([1,2,3]));
        assert.deepEqual([1,2,3], zs);
    });
    
    it('each /w array', function () {
        var zs = [];
        each(function (x) {
            zs.push(x);
        }, [1,2,3]);
        assert.deepEqual([1,2,3], zs);
    });
    
    it('each /w array + index', function () {
        var zs = [];
        each(function (x, ix) {
            zs.push([x, ix]);
        }, [1,2,3]);
        assert.deepEqual([[1, 0],[2, 1],[3, 2]], zs);
    });
 
    it('each /w object', function () {
        var zs = {};
        each(function (x, k) {
            zs[k] = x;
        }, { a: 1, b: 2 });
        assert.deepEqual({ a: 1, b: 2 }, zs);
    });
    
    it('inspect on end of stream', function () {
        assert.strictEqual('string', typeof stream([])().inspect());
    });

    it('toString on end of stream', function () {
        assert.strictEqual('string', typeof stream([])().toString());
    });

    it('repeat', function () {
        assert.deepEqual([ 11, 11, 11, 11, 11 ], consume(take(5, repeat(11))));
    });

    it('iterate', function () {
        assert.deepEqual([ 1, 2, 4 ], consume(take(3, iterate(times(2), 1))));
    });

    it('cycle /w array', function () {
        var s = cycle([ 1, 2, 3 ]);
        assert.strictEqual(true, isInfinite(s));
        assert.deepEqual([ 1, 2, 3, 1, 2, 3, 1, 2, 3 ], consume(take(9, s)));
    });
    
    it('cycle /w string', function () {
        var s = cycle("abc");
        assert.strictEqual(true, isInfinite(s));
        assert.deepEqual("abcabcabc", consumeString(take(9, s)));
    });

    it('cycle /w stream', function () {
        var s = cycle(lazy("abc"));
        assert.strictEqual(true, isInfinite(s));
        assert.deepEqual("abcabcabcabc", consumeString(take(12, s)));
    });
    
    it('cycle /w infinite stream', function () {
        var random = cycle(stream(function () {
            return 4;
        }));
        assert.strictEqual(true, isInfinite(random));
        assert.deepEqual([ 4, 4, 4, 4 ], consume(take(4, random)));
    });

    it('cycle /w object', function () {
        var xs = cycle({ a: 1, b: 2, c: 3 });
        assert.strictEqual(true, isInfinite(xs));
        var result = consume(take(6, xs));
        assert.deepEqual([], difference(result, [ 1, 2, 3 ]));
        assert.deepEqual([ 3, 2, 1 ], union([ 3, 2, 1 ], result));
    });
});
