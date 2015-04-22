require('../prelude').install(GLOBAL);
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
});
