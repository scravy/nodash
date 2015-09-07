require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

function maximum7(a, b, c, d, e, f, g) {
    return maximum([a, b, c, d, e, f, g]);
}

describe('Zips', function () {

    it('zip', function () {
        assert(eq(
            [ tuple(1, 4), tuple(2, 5), tuple(3, 6) ], 
            zip( [1, 2, 3], [4, 5, 6] )
        ));
    });
 
    it('zip3', function () {
        assert(eq(
            [ tuple3(1, 4, 7), tuple3(2, 5, 8), tuple3(3, 6, 9) ], 
            zip3( [1, 2, 3], [4, 5, 6], [7, 8, 9] )
        ));
    });

    it('zip4', function () {
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ], 
            zip4(
                [1, 2, 3], 
                [4, 5, 6], 
                [7, 8, 9], 
                [10, 11, 12]
            )
        ));
    });
});


describe('Zips (curried)', function () {

    it('zip', function () {
        assert(eq(
            [ tuple(1, 4), tuple(2, 5), tuple(3, 6) ], 
            zip( [1, 2, 3] )( [4, 5, 6] )
        ));
    });
 
    it('zip3', function () {
        assert(eq(
            [ tuple3(1, 4, 7), tuple3(2, 5, 8), tuple3(3, 6, 9) ], 
            zip3( [1, 2, 3] )( [4, 5, 6] )( [7, 8, 9] )
        ));
        assert(eq(
            [ tuple3(1, 4, 7), tuple3(2, 5, 8), tuple3(3, 6, 9) ], 
            zip3( [1, 2, 3] , [4, 5, 6] )( [7, 8, 9] )
        ));
        assert(eq(
            [ tuple3(1, 4, 7), tuple3(2, 5, 8), tuple3(3, 6, 9) ], 
            zip3( [1, 2, 3] )( [4, 5, 6], [7, 8, 9] )
        ));
    });

    it('zip4', function () {
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] )( [4, 5, 6] )( [7, 8, 9] )( [10, 11, 12] )
        ));

        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] , [4, 5, 6] )( [7, 8, 9] )( [10, 11, 12] )
        ));
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] )( [4, 5, 6] , [7, 8, 9] )( [10, 11, 12] )
        ));
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] )( [4, 5, 6] )( [7, 8, 9] , [10, 11, 12] )
        ));

        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] , [4, 5, 6] , [7, 8, 9] )( [10, 11, 12] )
        ));
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] )( [4, 5, 6] , [7, 8, 9] , [10, 11, 12] )
        ));
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] , [4, 5, 6] )( [7, 8, 9] , [10, 11, 12] )
        ));
    });

    it('zipWith4', function () {
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] )( [4, 5, 6] )( [7, 8, 9] )( [10, 11, 12] )
        ));

        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] , [4, 5, 6] )( [7, 8, 9] )( [10, 11, 12] )
        ));
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] )( [4, 5, 6] , [7, 8, 9] )( [10, 11, 12] )
        ));
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] )( [4, 5, 6] )( [7, 8, 9] , [10, 11, 12] )
        ));

        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] , [4, 5, 6] , [7, 8, 9] )( [10, 11, 12] )
        ));
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] )( [4, 5, 6] , [7, 8, 9] , [10, 11, 12] )
        ));
        assert(eq(
            [ tuple4(1, 4, 7, 10), tuple4(2, 5, 8, 11), tuple4(3, 6, 9, 12) ],
            zip4( [1, 2, 3] , [4, 5, 6] )( [7, 8, 9] , [10, 11, 12] )
        ));
    });
});
