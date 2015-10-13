require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Arrays', function () {

    it('isEmpty', function () {
        assert.strictEqual(true, isEmpty([]));
        assert.strictEqual(false, isEmpty([ 1 ]));
    });

    it('isEmpty /w string', function () {
        assert.strictEqual(true, isEmpty(""));
        assert.strictEqual(false, isEmpty("x"));
    });

    it('isEmpty /w object', function () {
        assert.strictEqual(true, isEmpty({}));
        assert.strictEqual(false, isEmpty({ a: 3 }));
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

    it('append', function () {
        assert.deepEqual([ 1, 2, 3, 4, 5, 6 ], append([ 1, 2, 3 ], [ 4, 5, 6 ]));
    });

    it('append /w string', function () {
        assert.deepEqual("abcabc", append("abc", "abc"));
    });

    it('take', function () {
        assert.deepEqual([], take(0, [ 10, 4, 18, 17 ]));
        assert.deepEqual([], take(10, []));
        assert.deepEqual([ 10, 4 ], take(2, [ 10, 4, 18, 17 ]));
        assert.deepEqual([ 10, 4 ], take(4, [ 10, 4 ]));
    });

    it('take /w string', function () {
        assert.deepEqual("abc", take(3, "abcdef"));
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

    it('splitAt', function () {
        assert(eq(tuple([ 1, 2 ], [ 3, 4 ]), splitAt(2, [ 1, 2, 3, 4 ])));
        assert(eq(tuple([ 1, 2 ], []), splitAt(3, [ 1, 2 ])));
        assert(eq(tuple([], []), splitAt(13, [])));
    });

    it('span', function () {
        assert(eq(tuple([ 1, 2 ], [ 3, 4, 5 ]), span(flip(lt)(3), [ 1, 2, 3, 4, 5 ])));
        assert(eq(tuple([], [ 1, 2, 3, 4, 5 ]), span(flip(gt)(3), [ 1, 2, 3, 4, 5 ])));
    });

    it('break', function () {
        assert(eq(tuple([], [ 1, 2, 3, 4 ]), break_(flip(lt)(3), [ 1, 2, 3, 4 ])));
        assert(eq(tuple([ 1, 2, 3 ], [ 4 ]), break_(flip(gt)(3), [ 1, 2, 3, 4 ])));
    });

    it('lookup', function () {
        assert.strictEqual(18, lookup('a', [ [ 'b', 17 ], [ 'a', 18 ], [ 'x', 19] ]));
    });

    it('lookup /w object', function () {
        assert.strictEqual(18, lookup('a', { b: 17, a: 18, x: 19 }));
    });

    it('concat', function () {
        assert.deepEqual([ 1, 2, 3, 4 ], concat([ [ 1, 2 ], [ 3, 4 ] ]));
    });

    it('concat /w string', function () {
        assert.deepEqual("abcdef", concat([ "abc", "def" ]));
    });

    it('concatMap', function () {
        assert.deepEqual([ 4, 4, 8, 8 ], concatMap(replicate(2), [ 4, 8 ]));
    });

    it('replicate', function () {
        assert.deepEqual([ 9, 9, 9, 9, 9 ], replicate(5, 9));
    });

    it('map', function () {
        assert.deepEqual([ 1, 2, 3 ], map(plus(1), [ 0, 1, 2 ]));
    });

    it('map /w string', function () {
        assert.deepEqual("234", map(compose(plus(1), Number), "123"));
    });

    it('map /w object', function () {
        assert.deepEqual({ a: 3, b: 4 }, map(plus(1), { a: 2, b: 3 }));
    });

    it('filter', function () {
        assert.deepEqual([], filter(flip(gte)(10), [ 1, 2, 3 ]));
        assert.deepEqual([ 3 ], filter(flip(gt)(2), [ 3 ]));
    });

    it('filter /w object', function () {
        assert.deepEqual({ b: 10, c: 15 }, filter(flip(gte)(10), { a: 5, b: 10, c: 15 }));
    });

    it('filter /w string', function () {
        assert.deepEqual("", filter(constant(false), "abc"));
        assert.deepEqual("bcbc", filter(function (x) {
            return x === 'b' || x === 'c';
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

    it('takeWhile', function () {
        assert.deepEqual([1, 4, 9], takeWhile(flip(lt)(10), [1, 4, 9, 11, 13, 18, 21]));
    });

    it('takeWhile /w string', function () {
        assert.strictEqual("849", takeWhile(isDigit, "849hasd03x"));
        assert.strictEqual("849", takeWhile(compose(not, isAsciiLetter), "849hasd03x"));
    });

    it('dropWhile', function () {
        assert.deepEqual([11, 13], dropWhile(flip(lt)(10), [1, 4, 9, 11, 13]));        
    });

    it('dropWhile /w string', function () {
        assert.strictEqual("hasd03x", dropWhile(isDigit, "849hasd03x"));
    });
    
    it('reverse', function () {
        assert.deepEqual([4, 3, 2, 1], reverse([1, 2, 3, 4]));
    });

    it('reverse /w string', function () {
        assert.deepEqual('dcba', reverse('abcd'));
    });

    it('at /w undefined', function () {
        assert.strictEqual(undefined, at(undefined, "prop"));
    });
    
    it('select /w path that does not exist', function () {
        assert.strictEqual(undefined, select("hello.world", {}));
    });
});
