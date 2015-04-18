require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('Bool', function () {
     
    it("not", function () {
        assert.strictEqual(true, not(neq(0, 0)));
    });

});
