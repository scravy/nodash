require('../prelude').install(GLOBAL);
var assert = map(flip, require('assert'));

describe('Either', function () {

    it("either", function () {
        assert.strictEqual(17, either(constant(17), constant(13), Left(19)));
        assert.strictEqual(13, either(constant(17), constant(13), Right(19)));
        assert.strictEqual(19, either(id, constant(13), Left(19)));
        assert.strictEqual(19, either(constant(17), id, Right(19)));
    });

    it("Left", function () {
        assert.deepEqual({ left: 7 }, Left(7));
    });

    it("Right", function () {
        assert.deepEqual({ right: 7 }, Right(7));
    });

    it("isLeft", function () {
        assert.strictEqual(true, isLeft(Left(7)));
        assert.strictEqual(false, isLeft(Right(7)));
    });

    it("isRight", function () {
        assert.strictEqual(false, isRight(Left(7)));
        assert.strictEqual(true, isRight(Right(7)));
    });

    it("lefts", function () {
        assert.deepEqual(
            [ 1, 4, 19 ],
            lefts([ Left(1), Right(2), Left(4), Right(8), Right(13), Left(19) ])
        );
    });

    it("rights", function () {
        assert.deepEqual(
            [ 2, 8, 13 ],
            rights([ Left(1), Right(2), Left(4), Right(8), Right(13), Left(19) ])
        );
    });

    it("partitionEithers", function () {
        assert.deepEqual(
            [ [ 1, 4, 19 ], [ 2, 8, 13 ] ],
            partitionEithers(
                [ Left(1), Right(2), Left(4), Right(8), Right(13), Left(19) ]
            )
        );
    });
});
