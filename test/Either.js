require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Either', function () {

    it("either", function () {
        assert.strictEqual(17, either(constant(17), constant(13), Left(19)));
        assert.strictEqual(13, either(constant(17), constant(13), Right(19)));
        assert.strictEqual(19, either(id, constant(13), Left(19)));
        assert.strictEqual(19, either(constant(17), id, Right(19)));
    });

    it("either /w not an either", function () {
        assert.strictEqual(null, either(constant(17), constant(13), {}));
    });

    it("Left", function () {
        assert.deepEqual({ left: 7 }, Left(7));
    });

    it("Right", function () {
        assert.deepEqual({ right: 7 }, Right(7));
    });

    it("isLeft", function () {
        assert.strictEqual(true, isLeft([ 7 ]));
        assert.strictEqual(true, isLeft(Left(7)));
        assert.strictEqual(false, isLeft(Right(7)));
    });

    it("isRight", function () {
        assert.strictEqual(true, isRight([ null, 7 ]));
        assert.strictEqual(false, isRight(Left(7)));
        assert.strictEqual(true, isRight(Right(7)));
    });

    it("fromLeft /w tuple", function () {
        assert.strictEqual(17, fromLeft([ 17 ]));
    });

    it("fromRight /w tuple", function () {
        assert.strictEqual(17, fromRight([ null, 17 ]));
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
        assert(eq(
            tuple([ 1, 4, 19 ], [ 2, 8, 13 ]),
            partitionEithers(
                [ Left(1), Right(2), Left(4), Right(8), Right(13), Left(19) ]
            )
        ));
    });
});
