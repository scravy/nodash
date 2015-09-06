require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Strings', function () {
     
    it("lines", function () {
        assert.deepEqual(
            [ "hello", "world", "outside" ],
            lines("hello\nworld\noutside")
        );
        assert.deepEqual(
            [ "", "hello", "world", "outside" ],
            lines("\nhello\nworld\noutside")
        );
        assert.deepEqual(
            [ "hello", "world", "", "outside" ],
            lines("hello\nworld\n\noutside")
        );
        assert.deepEqual(
            [ "hello", "world", "outside" ],
            lines("hello\nworld\noutside\n")
        );
    });

    it("unlines", function () {
        assert.deepEqual(
            "hello\nworld\noutside",
            unlines([ "hello", "world", "outside" ])
        );
        assert.deepEqual(
            "hello\nworld\noutside\n",
            unlines([ "hello", "world", "outside", "" ])
        );
        assert.deepEqual(
            "\nhello\nworld\noutside",
            unlines([ "", "hello", "world", "outside" ])
        );
        assert.deepEqual(
            "hello\nworld\n\noutside",
            unlines([ "hello", "world", "", "outside" ])
        );
    });

    it("words", function () {
        assert.deepEqual(
            [ "hello", "world", "outside" ],
            words("hello world outside")
        );
        assert.deepEqual(
            [ "hello", "world", "outside" ],
            words("hello\nworld\noutside")
        );
        assert.deepEqual(
            [ "hello", "world", "outside" ],
            words("hello\tworld\voutside")
        );
    });

    it("unwords", function () {
        assert.deepEqual(
            "hello world outside",
            unwords([ "hello", "world", "outside" ])
        );
    });
});
