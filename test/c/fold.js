require('../../nodash').install(GLOBAL);
var assert = require('../../util/assert');

describe('c/fold', function () {

    it('foldl', function () {
        assert.strictEqual(6, foldl(plus, 0, lazy([1, 2, 3])));
    });
 
    it('foldr', function () {
        assert.strictEqual(6, foldr(plus, 0, lazy([1, 2, 3])));        
    });
 
    it('map', function () {
        assert.deepEqual([1, 2, 3], listToArray(map(plus(1), lazy([0, 1, 2]))));
    });

    it('++', function () {
        assert.deepEqual(
            [1, 2, 3, 4],
            listToArray(append(lazy([1, 2]), lazy([3, 4])))
        );
    });

 });
