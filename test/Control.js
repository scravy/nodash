var P = require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Control', function () {

    it('until', function () {
        assert.strictEqual(16, until(flip(gt)(10), times(2), 1));
    });

});

