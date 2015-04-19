var P = require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('Lists', function () {

    function isDigit(x) {
        return x.match(/^[0-9]+$/);
    }

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
        assert.deepEqual([ 10, 4, 18, 17 ], drop(0, [ 10, 4, 18, 17 ]));
        assert.deepEqual([], drop(10, []));
        assert.deepEqual([ 18, 17 ], drop(2, [ 10, 4, 18, 17 ]));
        assert.deepEqual([], drop(4, [ 10, 4 ]));       
    });

    it('drop /w string', function () {
        assert.deepEqual("", drop(3, "abc"));
        assert.deepEqual("", drop(5, "abc"));
        assert.deepEqual("abcde", drop(0, "abcde"));
        assert.deepEqual("de", drop(3, "abcde"));
        assert.deepEqual("", drop(0, ""));
    });

    it('filter', function () {
        assert.deepEqual([], filter(flip(gte)(10), [ 1, 2, 3 ]));
        assert.deepEqual([ 3 ], filter(flip(gt)(2), [ 3 ]));
    });

    it('filter /w string', function () {
        assert.deepEqual("", filter(constant(false), "abc"));
        assert.deepEqual("bcbc", filter(function (x) {
            return x == 'b' || x == 'c';
        }, "abcdabcd"));
    });

    it('elem', function () {
        assert.strictEqual(true, elem(10, [ 10, 20, 30 ]));
        assert.strictEqual(false, elem(15, [ 10, 20, 30 ]));
    });

    it('elem /w string', function () {
        assert.strictEqual(true, elem('a', "abcd"));
        assert.strictEqual(false, elem('x', "abcd"));
    });

    it('notElem', function () {
        assert.strictEqual(true, notElem(15, []));
        assert.strictEqual(true, notElem(15, [ 10, 20, 30 ]));
        assert.strictEqual(false, notElem(10, [ 10, 20, 30 ]));
    });

    it('notElem /w string', function () {
        assert.strictEqual(true, notElem('x', "abcd"));
        assert.strictEqual(false, notElem('a', "abcd"));
    });

    it('isPrefixOf', function () {
        assert.strictEqual(true, isPrefixOf([ 0, 1 ], [ 0, 1, 2, 3 ]));
        assert.strictEqual(false, isPrefixOf([ 2, 3 ], [ 0, 1, 2, 3 ]));
    });

    it('isPrefixOf /w string', function () {
        assert.strictEqual(true, isPrefixOf('ab', 'abcd'));
        assert.strictEqual(false, isPrefixOf('cd', 'abcd'));
    });

    it('isSuffixOf', function () {
        assert.strictEqual(false, isSuffixOf([ 0, 1 ], [ 0, 1, 2, 3 ]));
        assert.strictEqual(true, isSuffixOf([ 2, 3 ], [ 0, 1, 2, 3 ]));
    });

    it('isSuffixOf /w string', function () {
        assert.strictEqual(false, isSuffixOf('ab', 'abcd'));
        assert.strictEqual(true, isSuffixOf('cd', 'abcd'));
    });

    it('isInfixOf', function () {
        assert.strictEqual(true, isInfixOf([ 0, 1 ], [ 0, 1, 2, 3 ]));
        assert.strictEqual(true, isInfixOf([ 1, 2 ], [ 0, 1, 2, 3 ]));
        assert.strictEqual(true, isInfixOf([ 2, 3 ], [ 0, 1, 2, 3 ]));
        assert.strictEqual(false, isInfixOf([ 2, 4 ], [ 0, 1, 2, 3 ]));
    });

    it('isInfixOf /w string', function () {
        assert.strictEqual(true, isInfixOf('ab', 'abcd'));
        assert.strictEqual(true, isInfixOf('bc', 'abcd'));
        assert.strictEqual(true, isInfixOf('cd', 'abcd'));
        assert.strictEqual(false, isInfixOf('dcdde', 'abcdcdef'));
        assert.strictEqual(true, isInfixOf('cde', 'abcdcdef'));
        assert.strictEqual(false, isInfixOf('ce', 'abcd'));
    });

    it('takeWhile', function () {
        assert.deepEqual([1, 4, 9], takeWhile(flip(lt)(10), [1, 4, 9, 11, 13, 18, 21]));
    });

    it('takeWhile /w string', function () {
        assert.strictEqual("849", takeWhile(isDigit, "849hasd03x"));
    });

    it('dropWhile', function () {
        assert.deepEqual([11, 13], dropWhile(flip(lt)(10), [1, 4, 9, 11, 13]));        
    });

    it('dropWhile /w string', function () {
        assert.strictEqual("hasd03x", dropWhile(isDigit, "849hasd03x"));
    });
});

