var P = require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('Lists', function () {

    it('transpose', function () {
        assert.deepEqual(
            [ ['a', 'd', 'f'], ['b', 'e', 'g'], ['c', 'h'], ['i'] ],
            transpose([ ['a', 'b', 'c'], ['d', 'e'], ['f', 'g', 'h', 'i' ] ])
        );
    });

});

