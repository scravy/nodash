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

    it('transpose /w object', function () {
        assert.deepEqual(
            { 3: 'a', 9: 'b', 10: 'c' },
            transpose({ a: 3, b: 9, c: 10 })
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
             "Feynman", "Floyd", "Gosling", "Graham", "Hamming",
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
                "Eich", "Hollerith", "Hoare", "Moore", "Parnas", "Zuse",
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

    it('sort /w object + toString', function () {

        function Person(id, name) {
            this.id = id;
            this.name = name;
        }

        Person.prototype.toString = function _Person_toString() {
            return this.name;
        };

        var jim = new Person(12, "Jim");
        var jack = new Person(28, "Jack");
        var johnny = new Person(39, "Johnny");

        var xs = [ jim, jack, johnny ];
        assert.deepEqual([ jack, jim, johnny ], sort(xs));
    });

    it('sort /w object + compareTo', function () {

        function Person(id, name) {
            this.id = id;
            this.name = name;
        }

        Person.prototype.compareTo = function _Person_compareTo(person) {
            return compare([ this.name, this.id ], [ person.name, person.id ]);
        };

        var jim = new Person(12, "Jim");
        var jim2 = new Person(28, "Jim");
        var johnny = new Person(39, "Johnny");

        var xs = [ johnny, jim, jim2 ];
        assert.deepEqual([ jim, jim2, johnny ], sort(xs));
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

        var jim = { name: "Jim", id: 19 };
        var jack = { name: "Jack", id: 17 };
        var johnny = { name: "Johnny", id: 13 };

        var xs = [ jim, jack, johnny ];
        assert.deepEqual(
            [ jack, jim, johnny ],
            sortBy(on(compare, flip(at)('name')), xs)
        );
        assert.deepEqual(
            [ johnny, jack, jim ],
            sortBy(on(compare, flip(at)('id')), xs)
        );
    });

    it('find', function () {
        assert.strictEqual(20, find(compose(eq(10),flip(div)(2)), [10, 20, 30]));
        assert.strictEqual(null, find(compose(eq(10),flip(div)(2)), [10, 30]));
        assert.strictEqual(null, find(compose(eq(10),flip(div)(2)), []));
    });

    it('find /w string', function () {
        assert.strictEqual('y', find(eq('y'), "xyz"));
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

    it('intersperse', function () {
        assert.deepEqual([], intersperse(0, []));
        assert.deepEqual([1,0,2,0,3], intersperse(0, [1,2,3]));
    });

    it('intercalate', function () {
        assert.deepEqual([], intercalate([1,2], []));
        assert.deepEqual([3,4,1,2,5,6], intercalate([1,2], [[3,4],[5,6]]));
    });

    it('nub', function () {
        assert.deepEqual([1,2,4], nub([1,1,2,4,4,4]));
    });
});

