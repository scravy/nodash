require('../nodash').install(GLOBAL);
var assert = require('assert');

function maximum7(a, b, c, d, e, f, g) {
    return maximum([a, b, c, d, e, f, g]);
}

describe('Zips', function () {

    it('zip', function () {
        assert.deepEqual(
            [ [1,4], [2,5], [3,6] ],
            zip( [1,2,3], [4,5,6] )
        );
    });
 
    it('zip /w stream', function () {
        assert.deepEqual(
            [ [1,4], [2,5], [3,6] ],
            consume(zip( stream([1,2,3]), [4,5,6] ))
        );
        assert.deepEqual(
            [ [1,4], [2,5], [3,6] ],
            consume(zip( [1,2,3], stream([4,5,6]) ))
        );
        assert.deepEqual(
            [ [1,4], [2,5], [3,6] ],
            consume(zip( stream([1,2,3]), stream([4,5,6]) ))
        );
    });

    it('zip3', function () {
        assert.deepEqual(
            [ [1,4,7], [2,5,8], [3,6,9] ],
            zip3( [1,2,3], [4,5,6], [7,8,9] )
        );
    });

    it('zip3 /w stream', function () {
        assert.deepEqual(
            [ [1,4,7], [2,5,8], [3,6,9] ],
            consume(zip3( stream([1,2,3]), [4,5,6], [7,8,9] ))
        );
        assert.deepEqual(
            [ [1,4,7], [2,5,8], [3,6,9] ],
            consume(zip3( [1,2,3], stream([4,5,6]), [7,8,9] ))
        );
        assert.deepEqual(
            [ [1,4,7], [2,5,8], [3,6,9] ],
            consume(zip3( stream([1,2,3]), stream([4,5,6]), [7,8,9] ))
        );
        assert.deepEqual(
            [ [1,4,7], [2,5,8], [3,6,9] ],
            consume(zip3( stream([1,2,3]), stream([4,5,6]), stream([7,8,9]) ))
        );
    });

    it('zip4', function () {
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            consume(zip4(
                stream([1,2,3]),
                stream([4,5,6]),
                stream([7,8,9]),
                stream([10,11,12])
            ))
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            consume(zip4(
                [1,2,3],
                stream([4,5,6]),
                stream([7,8,9]),
                stream([10,11,12])
            ))
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            consume(zip4(
                [1,2,3],
                stream([4,5,6]),
                stream([7,8,9]),
                [10,11,12]
            ))
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            consume(zip4(
                [1,2,3],
                stream([4,5,6]),
                [7,8,9],
                stream([10,11,12])
            ))
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            consume(zip4(
                [1,2,3],
                stream([4,5,6]),
                [7,8,9],
                [10,11,12]
            ))
        );
    });
 
    it('zip4 /w stream', function () {
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3], [4,5,6], [7,8,9], [10,11,12] )
        );
    });

});


describe('Zips (curried)', function () {

    it('zip', function () {
        assert.deepEqual(
            [ [1,4], [2,5], [3,6] ],
            zip( [1,2,3] )( [4,5,6] )
        );
    });
 
    it('zip3', function () {
        assert.deepEqual(
            [ [1,4,7], [2,5,8], [3,6,9] ],
            zip3( [1,2,3] )( [4,5,6] )( [7,8,9] )
        );
        assert.deepEqual(
            [ [1,4,7], [2,5,8], [3,6,9] ],
            zip3( [1,2,3] , [4,5,6] )( [7,8,9] )
        );
        assert.deepEqual(
            [ [1,4,7], [2,5,8], [3,6,9] ],
            zip3( [1,2,3] )( [4,5,6] , [7,8,9] )
        );
    });

    it('zip4', function () {
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] )( [4,5,6] )( [7,8,9] )( [10,11,12] )
        );

        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] , [4,5,6] )( [7,8,9] )( [10,11,12] )
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] )( [4,5,6] , [7,8,9] )( [10,11,12] )
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] )( [4,5,6] )( [7,8,9] , [10,11,12] )
        );

        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] , [4,5,6] , [7,8,9] )( [10,11,12] )
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] )( [4,5,6] , [7,8,9] , [10,11,12] )
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] , [4,5,6] )( [7,8,9] , [10,11,12] )
        );
    });

    it('zipWith4', function () {
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] )( [4,5,6] )( [7,8,9] )( [10,11,12] )
        );

        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] , [4,5,6] )( [7,8,9] )( [10,11,12] )
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] )( [4,5,6] , [7,8,9] )( [10,11,12] )
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] )( [4,5,6] )( [7,8,9] , [10,11,12] )
        );

        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] , [4,5,6] , [7,8,9] )( [10,11,12] )
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] )( [4,5,6] , [7,8,9] , [10,11,12] )
        );
        assert.deepEqual(
            [ [1,4,7,10], [2,5,8,11], [3,6,9,12] ],
            zip4( [1,2,3] , [4,5,6] )( [7,8,9] , [10,11,12] )
        );
    });


});