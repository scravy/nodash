var P = require('../prelude').install(GLOBAL);
var assert = map(flip, require('assert'));

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
        assert.strictEqual(minimum(list), maximumBy(compose2(negate, compare), list));
    });

    it('minimumBy', function () {
        var list = [2, 10, 5, 8, 21, 1, 9, 8, 3];
        assert.strictEqual(maximum(list), minimumBy(compose2(negate, compare), list));
    });

    it('sort', function () {
        assert.deepEqual([], sort([]));
        assert.deepEqual([{}], sort([{}]));
    });

    it('sort /w list of numbers', function () {
        assert.deepEqual([1,2,3,4,10,15,20], sort([4,20,2,10,3,15,1]));
    });

    it('sort /w list of strings', function () {
        assert.deepEqual(
            ["Amdahl", "Babbage", "Church", "Curry", "Dijkstra", "Eich",
             "Feynman", "Floyd", "Gosling", "Graham", "Gödel", "Hamming",
             "Hoare", "Hollerith", "Hopper", "Huffman", "Hughes", "Ichbiah",
             "Joy", "Karp", "Kay", "Kleene", "Knuth", "Kolmogorov",
             "Kruskal", "Lamport", "Liskov", "Lovelace", "McCarthy",
             "Milner", "Moore", "Naur", "Neumann", "Parnas", "Peyton Jones",
             "Rabin", "Ritchie", "Shamir", "Shannon", "Steele", "Thompson",
             "Torvalds", "Turing", "Ullman", "Weizenbaum", "Wheeler",
             "Wijngaarden", "Wirth", "Zuse" ],
            sort([
                "Curry", "Hughes", "Huffman", "Lovelace", "Steele", "Ullman",
                "Hopper", "Joy", "Kay", "Karp", "Kolmogorov", "Rabin", "Shamir",
                "Dijkstra", "Feynman", "Hamming", "Liskov", "Naur", "Shannon",
                "Church", "Floyd", "Ichbiah", "Knuth", "Neumann", "Ritchie",
                "Weizenbaum", "Thompson", "Turing", "Torvalds", "Wijngaarden",
                "Eich", "Gödel", "Hollerith", "Hoare", "Moore", "Parnas", "Zuse",
                "Amdahl", "Gosling", "Kleene", "Lamport", "Peyton Jones", "Wirth",
                "Babbage", "Graham", "Kruskal", "Milner", "McCarthy", "Wheeler"
            ])
        );
    });

    it('sort /w string', function () {
        assert.deepEqual("", sort(""));
        assert.deepEqual("a", sort("a"));
        assert.deepEqual("abcd", sort("dbca"));
    });

    it('sort /w arrays', function () {
        assert.deepEqual([
            [ 0, 1 ],
            [ 0, 1, 2 ],
            [ 1, 2, 3 ],
            [ 1, 2, 3 ]
        ], sort([ [ 0, 1 ], [ 1, 2, 3 ], [ 0, 1, 2 ], [ 1, 2, 3 ] ]));
    });

    it('sortBy', function () {
        assert.deepEqual([], sortBy(compose2(negate, compare), []));
        assert.deepEqual([{}], sortBy(compose2(negate, compare), [{}]));
        assert.deepEqual([4, 3, 2, 1], sortBy(compose2(negate, compare), [1, 2, 3, 4]));
    });

    it('sortBy /w string', function () {
        assert.deepEqual("abcd", sortBy(compare, "cbda"));
    });

    it('sortBy /w object', function () {
        var xs = [ { name: "Jim", id: 19 },
                   { name: "Jack", id: 17 },
                   { name: "Johnny", id: 13 } ];

    assert.deepEqual(
        [ { name: "Jack", id: 17 }, { name: "Jim", id: 19 }, { name: "Johnny", id: 13 } ],
        sortBy(on(compare, flip(at)('name')), xs)
    );
    assert.deepEqual(
        [ { name: "Johnny", id: 13 }, { name: "Jack", id: 17 }, { name: "Jim", id: 19 } ],
        sortBy(on(compare, flip(at)('id')), xs)
    );

    });

});

