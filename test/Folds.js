require('../nodash').install(GLOBAL);
var assert = map(flip, require('assert'));

describe('Folds', function () {

    it('foldl', function () {
        assert.deepEqual([4, 3, 2, 1], foldl(flip(cons), [], [1, 2, 3, 4]));
    });

    it('foldl /w stream', function () {
        assert.deepEqual(
            [4, 3, 2, 1],
            consume(foldl(flip(cons), [], stream([1, 2, 3, 4])))
        );
        assert.strictEqual(
            4*3*2*1,
            consume(foldl(times, 1, stream([1, 2, 3, 4])))
        );
    });  
 
    it('foldl1', function () {
        assert.strictEqual(7*1*4*3, foldl1(times, [7, 1, 4, 3]));
    });

    it('foldl1 /w stream', function () {
        assert.strictEqual(
            7*1*4*3,
            consume(foldl1(times, stream([7, 1, 4, 3])))
        );
        assert.deepEqual(
            [ 7, 1, 4, 3 ],
            consume(foldl1(append, stream([ [ 7 ], [ 1 ], [ 4 ], [ 3 ]])))
        );
    });

    it('foldr', function () {
        assert.deepEqual([1, 2, 3, 4], foldr(cons, [], [1, 2, 3, 4]));        
    });
 
    it('foldr1', function () {
        assert.strictEqual(7*1*4*3, foldr1(times, [7, 1, 4, 3]));
    });

    it('maximum', function () {
        assert.strictEqual(7, maximum([1, 4, 3, 2, 5, 7, 4, 3, 6]));
    });

    it('minimum', function () {
        assert.strictEqual(2, minimum([10, 4, 3, 2, 5, 7, 4, 3, 6]));
    });

    it('sum', function () {
        assert.strictEqual(7+1+4+3, sum([7, 1, 4, 3]));
    });
 
    it('product', function () {
        assert.strictEqual(7*1*4*3, product([7, 1, 4, 3]));
    });

    it('or', function () {
        assert.strictEqual(true, or([false, false, true]));
        assert.strictEqual(true, or([true, true, true]));
        assert.strictEqual(false, or([false, false, false]));
        assert.strictEqual(false, or([]));
    });

    it('and', function () {
        assert.strictEqual(false, and([false, false, true]));
        assert.strictEqual(true, and([true, true, true]));
        assert.strictEqual(false, and([false, false, false]));
        assert.strictEqual(true, and([]));
    });

    it('any', function () {
        assert.strictEqual(true, any(id, [false, false, true]));
        assert.strictEqual(true, any(id, [true, true, true]));
        assert.strictEqual(false, any(id, [false, false, false]));
        assert.strictEqual(false, any(id, []));
    });

    it('all', function () {
        assert.strictEqual(false, all(id, [false, false, true]));
        assert.strictEqual(true, all(id, [true, true, true]));
        assert.strictEqual(false, all(id, [false, false, false]));
        assert.strictEqual(true, all(id, []));
    });

    it('scanl', function () {
        assert.deepEqual(
            [[], [1], [2, 1], [3, 2, 1], [4, 3, 2, 1]],
            scanl(flip(cons), [], [1, 2, 3, 4])
        );
    });
 
    it('scanl /w stream', function () {
        assert.deepEqual(
            [[], [1], [2, 1], [3, 2, 1], [4, 3, 2, 1]],
            consume(scanl(flip(cons), [], stream([1, 2, 3, 4])))
        );
    });

    it('scanl /w infinite stream', function () {
        assert.deepEqual(
            [[], [7], [7, 7]],
            consume(take(3, scanl(flip(cons), [], repeat(7))))
        );
    });

    it('scanl1', function () {
        assert.deepEqual([7, 7, 28, 84], scanl1(times, [7, 1, 4, 3]));
    });

    it('scanl1 /w stream', function () {
        assert.deepEqual(
            [7, 7, 28, 84],
            consume(scanl1(times, stream([7, 1, 4, 3])))
        );
    });

    it('scanr', function () {
        assert.deepEqual(
            [[1, 2, 3, 4], [2, 3, 4], [3, 4], [4], []],
            scanr(cons, [], [1, 2, 3, 4])
        );
    });
 
    it('scanr1', function () {
        assert.deepEqual([84, 12, 12, 3], scanr1(times, [7, 1, 4, 3]));
    });

});
