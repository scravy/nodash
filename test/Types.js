var P = require('../nodash').install(GLOBAL);
var assert = require('assert');

describe('Types', function () {

    it('isObject /w object', function () {
        assert.strictEqual(true, isObject({}));
    });

    it('isObject /w array', function () {
        assert.strictEqual(false, isObject([]));
    });

    it('isObject /w number', function () {
        assert.strictEqual(false, isObject(7));
    });

    it('isObject /w undefined', function () {
        assert.strictEqual(false, isObject(undefined));
    });

    it('isObject /w null', function () {
        assert.strictEqual(false, isObject(null));
    });

    it('isArray /w object', function () {
        assert.strictEqual(false, isArray({}));
    });

    it('isArray /w array', function () {
        assert.strictEqual(true, isArray([]));
    });

    it('isArray /w number', function () {
        assert.strictEqual(false, isArray(7));
    });

    it('isArray /w undefined', function () {
        assert.strictEqual(false, isArray(undefined));
    });

    it('isArray /w null', function () {
        assert.strictEqual(false, isArray(null));
    });

    it('isNumeric /w "abc"', function () {
        assert.strictEqual(false, isNumeric("abc"));
    });
    
    it('isNumeric /w "abc456"', function () {
        assert.strictEqual(false, isNumeric("abc456"));
    });

    it('isNumeric /w "789"', function () {
        assert.strictEqual(true, isNumeric("789"));
    });

});
