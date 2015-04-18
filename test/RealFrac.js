require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('RealFrac', function () {

    it('properFraction', function () {
        var x = properFraction( 8.5 );
        var y = properFraction( -8.5 );
        assert.deepEqual([ 8, 0.5 ], x);
        assert.deepEqual([ -8, -0.5 ], y);
    });

});

