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

var assert = require('../util/assert');

describe('Polyfills', function () {

    var P;

    before(function () {
        P = require('../nodash').install({}, { Math: DumbMath });
    });

    it('sinh', function () {
        assert.strictEqual(0, P.sinh(0));
        assert.strictEqual(-Infinity, P.sinh(-Infinity));
        assert.strictEqual(Infinity, P.sinh(Infinity));
    });

    it('cosh', function () {
        assert.strictEqual(1, P.cosh(0));
    });

    it('tanh', function () {
        assert.strictEqual(1, P.tanh(Infinity));
        assert.strictEqual(-1, P.tanh(-Infinity));
        assert.strictEqual(0, P.tanh(0));
    });

    it('asinh', function () {
        assert.strictEqual(0, P.asinh(0));
        assert.strictEqual(-Infinity, P.asinh(-Infinity));
        assert.strictEqual(Infinity, P.asinh(Infinity));
    });

    it('acosh', function () {
        assert.strictEqual(0, P.acosh(1));
    });

    it('atanh', function () {
        assert.strictEqual(Infinity, P.atanh(1));
        assert.strictEqual(-Infinity, P.atanh(-1));
        assert.strictEqual(0, P.atanh(0));
    });

    it('truncate', function () {
        assert.strictEqual(9, P.truncate(9.5));
        assert.strictEqual(-9, P.truncate(-9.5));
        assert.strictEqual(0, P.truncate(0.5));
        assert.strictEqual(0, P.truncate(-0.5));
        assert.strictEqual(0, P.truncate(0));
    });

    it('signum', function () {
        assert.strictEqual(1, P.signum(9.5));
        assert.strictEqual(-1, P.signum(-9.5));        
        assert.strictEqual(0, P.signum(0));
    });
});

describe('Polyfills (`Set` missing)', function () {

    var P;

    before(function () {
        P = require('../nodash').install({});
    });

    it('nub', function () {
        assert.deepEqual([1,2,4], P.nub([1,1,2,4,4,4]));
    });

    it('union', function () {
        assert.deepEqual([1,2,4], P.union([1,2], [2,4]));
    });

    it('intersect', function () {
        assert.deepEqual([3,2], P.intersect([1,3,2], [5,2,3,4]));
    });
});

describe('Polyfills (`Set` available)', function () {

    var P;

    before(function () {
        P = require('../nodash').install({}, { Set: require('../lib/Set') });
    });
    
    it('nub', function () {
        assert.deepEqual([1,2,4], P.nub([1,1,2,4,4,4]));
    });

    it('union', function () {
        assert.deepEqual([1,2,4], P.union([1,2], [2,4]));
    });

    it('intersect', function () {
        assert.deepEqual([3,2], P.intersect([1,3,2], [5,2,3,4]));
    });
});
