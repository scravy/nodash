var P = require('../nodash').install(GLOBAL);
var assert = map(flip, require('assert'));

describe('Lists', function () {

    it('isNull', function () {
        assert.strictEqual(true, isNull([]));
        assert.strictEqual(false, isNull([ 1 ]));
    });

    it('isNull /w string', function () {
        assert.strictEqual(true, isNull(""));
        assert.strictEqual(false, isNull("x"));
    });

    it('isNull /w object', function () {
        assert.strictEqual(true, isNull({}));
        assert.strictEqual(false, isNull({ a: 3 }));
    });

    it('isNull /w stream', function () {
        assert.strictEqual(true, isNull(stream("")));
        assert.strictEqual(false, isNull(stream("x")));
    });

    it('length', function () {
        assert.strictEqual(0, length([]));
        assert.strictEqual(1, length([ 1 ]));
    });

    it('length /w string', function () {
        assert.strictEqual(0, length(""));
        assert.strictEqual(1, length("x"));
    });

    it('length /w stream', function () {
        assert.strictEqual(0, length(stream("")));
        assert.strictEqual(7, length(stream("abcdefg")));
    });

    it('length /w infinite stream', function () {
        assert.strictEqual(Infinity, length(stream(idf(3))));
    });

    it('head', function () {
        assert.strictEqual(10, head([ 10, 4, 21 ]));
    });

    it('head /w string', function () {
        assert.strictEqual('a', head("abc"));
    });

    it('head /w stream', function () {
        assert.strictEqual(10, head(stream([ 10 ])));
        assert.strictEqual(10, head(stream([ 10, 12 ])));
        assert.strictEqual(undefined, head(stream([])));
    });

    it('tail', function () {
        assert.deepEqual([ 4, 21 ], tail([ 10, 4, 21 ]));
    });

    it('tail /w string', function () {
        assert.strictEqual("bc", tail("abc"));
    });

    it('tail /w stream', function () {
        assert.deepEqual([ 4, 21 ], consume(tail(stream([ 10, 4, 21 ]))));
    });

    it('init', function () {
        assert.deepEqual([ 10, 4 ], init([ 10, 4, 21 ]));
    });

    it('init /w string', function () {
        assert.strictEqual("ab", init("abc"));
    });

    it('init /w stream', function () {
        assert.strictEqual("ab", consumeString(init(stream("abc"))));
    });

    it('last', function () {
        assert.strictEqual(21, last([ 10, 4, 21 ]));
    });

    it('last /w string', function () {
        assert.strictEqual('c', last("abc"));
    });

    it('last /w stream', function () {
        assert.strictEqual('z', last(stream("xyz")));
    });

    it('append', function () {
        assert.deepEqual([ 1, 2, 3, 4, 5, 6 ], append([ 1, 2, 3 ], [ 4, 5, 6 ]));
    });

    it('append /w string', function () {
        assert.deepEqual("abcabc", append("abc", "abc"));
    });

    it('append /w stream', function () {
        assert.deepEqual(
            [ 9, 2, 8, 7 ],
            consume(append(stream([ 9, 2 ]), stream([ 8, 7 ])))
        );
        assert.deepEqual(
            [ 9, 2, 8, 7 ],
            consume(append([ 9, 2 ], stream([ 8, 7 ])))
        );
        assert.deepEqual(
            [ 9, 2, 8, 7 ],
            consume(append(stream([ 9, 2 ]), [ 8, 7 ]))
        );
    });

    it('append /w infinite stream', function () {
        assert.deepEqual(
            [ 9, 9, 9, 9, 9 ],
            consume(take(5, append(repeat(9), stream([ 8, 7 ]))))
        );
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

    it('take /w stream', function () {
        assert.deepEqual("123", consumeString(take(3, stream("12345"))));
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

    it('drop /w stream', function () {
        assert.deepEqual("45", consumeString(drop(3, stream("12345"))));
    });

    it('splitAt', function () {
        assert.deepEqual([ [ 1, 2 ], [ 3, 4 ] ], splitAt(2, [ 1, 2, 3, 4 ]));
        assert.deepEqual([ [ 1, 2 ], [] ], splitAt(3, [ 1, 2 ]));
        assert.deepEqual([ [], [] ], splitAt(13, []));
    });

    it('span', function () {
        assert.deepEqual([ [ 1, 2 ], [ 3, 4, 5 ]], span(flip(lt)(3), [ 1, 2, 3, 4, 5 ]));
        assert.deepEqual([ [], [ 1, 2, 3, 4, 5 ]], span(flip(gt)(3), [ 1, 2, 3, 4, 5 ]));
    });

    it('break', function () {
        assert.deepEqual([ [], [ 1, 2, 3, 4 ]], P.break(flip(lt)(3), [ 1, 2, 3, 4 ]));
        assert.deepEqual([ [ 1, 2, 3 ], [ 4 ]], P.break(flip(gt)(3), [ 1, 2, 3, 4 ]));
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

    it('cons /w stream', function () {
        assert.deepEqual(
            [ 1, 2, 3 ],
            consume(cons(1, stream([2, 3])))
        );
        assert.deepEqual(
            [ 1 ],
            consume(cons(1, stream([])))
        );
    });

    it('cons /w infinite stream', function () {
        assert.deepEqual(
            [ 1, 3, 3 ],
            consume(take(3, cons(1, stream(idf(3)))))
        );
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

    it('map /w stream', function () {
        assert.deepEqual([ 2, 4, 6 ], consume(map(times(2), stream([ 1, 2, 3 ]))));
    });

    it('map /w infinite stream', function () {
        assert.deepEqual(Infinity, length(map(times(2), repeat(3))));
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
            return x == 'b' || x == 'c';
        }, "abcdabcd"));
    });

    it('filter /w stream', function () {
        assert.deepEqual(
            "anc.",
            consumeString(filter(compose(not, isDigit), stream("a73nc.")))
        );
    });

    it('filter /w infinite stream', function () {
        assert.deepEqual(
            "xxx",
            consumeString(take(3, filter(compose(not, isDigit), repeat('x'))))
        );
    });

    it('elem', function () {
        assert.strictEqual(true, elem(10, [ 10, 20, 30 ]));
        assert.strictEqual(false, elem(15, [ 10, 20, 30 ]));
    });

    it('elem /w string', function () {
        assert.strictEqual(true, elem('a', "abcd"));
        assert.strictEqual(false, elem('x', "abcd"));
    });

    it('elem /w stream', function () {
        assert.strictEqual(true, elem('a', stream("abcd")));
        assert.strictEqual(false, elem('x', stream("abcd")));
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

    it('notElem /w stream', function () {
        assert.strictEqual(true, notElem('x', stream("abcd")));
        assert.strictEqual(false, notElem('a', stream("abcd")));
    });

    it('takeWhile', function () {
        assert.deepEqual([1, 4, 9], takeWhile(flip(lt)(10), [1, 4, 9, 11, 13, 18, 21]));
    });

    it('takeWhile /w string', function () {
        assert.strictEqual("849", takeWhile(isDigit, "849hasd03x"));
        assert.strictEqual("849", takeWhile(compose(not, isAsciiLetter), "849hasd03x"));
    });

    it('takeWhile /w stream', function () {
        assert.deepEqual(
            [ '8', '4', '9' ],
            consume(takeWhile(isDigit, stream("849hasd03x")))
        );
        assert.deepEqual(
            [ '8', '4', '9' ],
            consume(takeWhile(compose(not, isAsciiLetter), stream("849hasd03x")))
        );
    });

    it('dropWhile', function () {
        assert.deepEqual([11, 13], dropWhile(flip(lt)(10), [1, 4, 9, 11, 13]));        
    });

    it('dropWhile /w string', function () {
        assert.strictEqual("hasd03x", dropWhile(isDigit, "849hasd03x"));
    });

    it('dropWhile /w stream', function () {
        assert.strictEqual(
            "hasd03x",
            consumeString(dropWhile(isDigit, stream("849hasd03x")))
        );
    });

    it('reverse', function () {
        assert.deepEqual([4, 3, 2, 1], reverse([1, 2, 3, 4]));
    });

    it('reverse /w string', function () {
        assert.deepEqual('dcba', reverse('abcd'));
    });

    it('reverse /w stream', function () {
        assert.deepEqual('dcba', consumeString(reverse(stream("abcd"))));
    });

    it('at /w stream', function () {
        assert.strictEqual('d', flip(at)(3, stream("abcdef")));
        assert.strictEqual(undefined, flip(at)(13, stream("abcdef")));
        assert.strictEqual(undefined, flip(at)(0, stream([])));
        assert.strictEqual(1, flip(at)(0, stream([ 1 ])));
    });
});

