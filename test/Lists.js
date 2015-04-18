var P = require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('Lists', function () {

    it('isNull', function () {
        assert.strictEqual(true, isNull([]));
        assert.strictEqual(false, isNull([ 1 ]));
    });

    it('isNull /w string', function () {
        assert.strictEqual(true, isNull(""));
        assert.strictEqual(false, isNull("x"));
    });

    it('length', function () {
        assert.strictEqual(0, length([]));
        assert.strictEqual(1, length([ 1 ]));
    });

    it('length /w string', function () {
        assert.strictEqual(0, length(""));
        assert.strictEqual(1, length("x"));
    });

    it('head', function () {
        assert.strictEqual(10, head([ 10, 4, 21 ]));
    });

    it('head /w string', function () {
        assert.strictEqual('a', head("abc"));
    });

    it('tail', function () {
        assert.deepEqual([ 4, 21 ], tail([ 10, 4, 21 ]));
    });

    it('tail /w string', function () {
        assert.strictEqual("bc", tail("abc"));
    });

    it('init', function () {
        assert.deepEqual([ 10, 4 ], init([ 10, 4, 21 ]));
    });

    it('init /w string', function () {
        assert.strictEqual("ab", init("abc"));
    });

    it('last', function () {
        assert.strictEqual(21, last([ 10, 4, 21 ]));
    });

    it('last /w string', function () {
        assert.strictEqual('c', last("abc"));
    });

    it('take', function () {
        assert.deepEqual([], take(0, [ 10, 4, 18, 17 ]));
        assert.deepEqual([], take(10, []));
        assert.deepEqual([ 10, 4 ], take(2, [ 10, 4, 18, 17 ]));
        assert.deepEqual([ 10, 4 ], take(4, [ 10, 4 ]));
    });

    it('take /w string', function () {
        assert.deepEqual("abc", take(3, "abc"));
        assert.deepEqual("", take(0, ""));
    });

    it('drop', function () {

    });

    it('drop /w string', function () {

    });

    it('takeWhile', function () {

    });

    it('takeWhile /w string', function () {

    });

    it('dropWhile', function () {

    });

    it('dropWhile /w string', function () {

    });
});

