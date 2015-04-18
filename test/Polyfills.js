var DumbMath = {
    abs: Math.abs,
    acos: Math.acos,
    asin: Math.asin,
    atan: Math.atan,
    ceil: Math.ceil,
    cos: Math.cos,
    exp: Math.exp,
    floor: Math.floor,
    log: Math.log,
    sin: Math.sin,
    sqrt: Math.sqrt,
    tan: Math.tan,
    pow: Math.pow,
    max: Math.max,
    min: Math.min
};

var assert = require('assert');

describe('Polyfills', function () {

    it('isArray in map', function () {
        require('../prelude').install(GLOBAL, DumbMath, {});
        var plus1 = map(plus(1));
        assert.deepEqual([2, 3, 4], plus1([1, 2, 3]));
    });

});
