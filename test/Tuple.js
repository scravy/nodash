require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Tuple', function () {

    it('fst', function () {
        assert.strictEqual('x', fst(tuple('x', 'y')));
    });

    it('snd', function () {
        assert.strictEqual('y', snd(tuple('x', 'y')));
    });

});
