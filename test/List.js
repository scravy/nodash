require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Lists', function () {

    it('new List', function () {
        assert(new List(3, 7) instanceof List);
    });

    it('singleton', function () {
        var xs = singleton(7);
        assert.strictEqual(7, xs.head());
        assert(xs.tail().isEmpty());
    });

    it('emptyList', function () {
        assert(emptyList().isEmpty());
    });

});
