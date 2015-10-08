require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Bool', function () {
     
    it("not", function () {
        assert.strictEqual(true, not(neq(0, 0)));
    });

    it("bool", function () {
        assert.strictEqual(21, bool(17, 21, true));
        assert.strictEqual(17, bool(17, 21, false));
        assert.strictEqual(17, bool(17, 21, 0));
        assert.strictEqual(21, bool(17, 21, {}));
    });
});
