require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('Function', function () {

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

});

