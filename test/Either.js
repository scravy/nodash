require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Either', function () {

    it('either', function () {
        assert.strictEqual(17, either(constant(17), constant(13), Left(19)));
        assert.strictEqual(13, either(constant(17), constant(13), Right(19)));
        assert.strictEqual(19, either(id, constant(13), Left(19)));
        assert.strictEqual(19, either(constant(17), id, Right(19)));
        assert.throws(function () {
            either(id, id, 17);
        });
    });

    it('Left + isLeft', function () {
        assert(isLeft(Left(7)));
        assert(isLeft(new Left(7)));
    });

    it('Right + isRight', function () {
        assert(isRight(Right(7)));
        assert(isRight(new Right(7)));
    });

    it('fromLeft', function () {
        assert.strictEqual(11, fromLeft(Left(11)));
    });

    it('fromRight', function () {
        assert.strictEqual(11, fromRight(Right(11)));
    });

    it('fromLeft throws', function () {
        assert.throws(function () {
            fromLeft(Right(11));
        });
    });

    it('fromRight throws', function () {
        assert.throws(function () {
            fromRight(Left(11));
        });
    });

    it('lefts', function () {
        assert.deepEqual(
            [ 1, 4, 19 ],
            lefts([ Left(1), Right(2), Left(4), Right(8), Right(13), Left(19) ])
        );
    });

    it('rights', function () {
        assert.deepEqual(
            [ 2, 8, 13 ],
            rights([ Left(1), Right(2), Left(4), Right(8), Right(13), Left(19) ])
        );
    });

    it('partitionEithers', function () {
        assert(eq(
            tuple([ 1, 4, 19 ], [ 2, 8, 13 ]),
            partitionEithers(
                [ Left(1), Right(2), Left(4), Right(8), Right(13), Left(19) ]
            )
        ));
    });
});
