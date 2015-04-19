var P = require('../prelude').install(GLOBAL);
var assert = map(flip, require('assert'));

describe('Control', function () {

    it('until', function () {
        assert.strictEqual(16, until(flip(gt)(10), times(2), 1));
    });

});

