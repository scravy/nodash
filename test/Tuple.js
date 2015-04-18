var P = require('../prelude').install(GLOBAL);
var assert = require('assert');

describe('Tuple', function () {

    it('fst', function () {
        assert.strictEqual('x', fst(['x', 'y']));
    });

    it('snd', function () {
        assert.strictEqual('y', snd(['x', 'y']));
    });

    it(',', function () {
        assert.deepEqual(['x', 'y'], P[',']('x', 'y'));
    });

});
