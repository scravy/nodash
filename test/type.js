var P = require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('type', function () {

    it('isUndefined /w undefined', function () {
        assert.strictEqual(true, isUndefined(undefined));
    });

    it('isUndefined /w null', function () {
        assert.strictEqual(false, isUndefined(null));
    });

    it('isBoolean /w true', function () {
        assert.strictEqual(true, isBoolean(true));
    });

    it('isBoolean /w false', function () {
        assert.strictEqual(true, isBoolean(false));
    });

    it('isBoolean /w undefined', function () {
        assert.strictEqual(false, isBoolean(undefined));
    });

    it('isBoolean /w object', function () {
        assert.strictEqual(false, isBoolean({}));
    });

    it('isInteger /w undefined', function () {
        assert.strictEqual(false, isInteger(undefined));
    });

    it('isInteger /w integer', function () {
        assert.strictEqual(true, isInteger(-1));
        assert.strictEqual(true, isInteger(0));
        assert.strictEqual(true, isInteger(1));
        assert.strictEqual(true, isInteger(Math.pow(2, 53) - 1));
    });

    it('isInteger /w double', function () {
        assert.strictEqual(false, isInteger(Math.PI));
        assert.strictEqual(false, isInteger(1.5));
        assert.strictEqual(false, isInteger(-Math.E));
    });

    it('isInteger /w NaN', function () {
        assert.strictEqual(false, isInteger(NaN));
    });

    it('isInteger /w Infinity', function () {
        assert.strictEqual(false, isInteger(Infinity));
        assert.strictEqual(false, isInteger(-Infinity));
    });

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

    it('typeOf /w undefined', function () {
        assert.strictEqual(undefined, typeOf(undefined));
    });

    it('typeOf /w null', function () {
        assert.strictEqual(null, typeOf(null));
    });

    it('typeOf /w Number', function () {
        assert.strictEqual(Number, typeOf(7));
        assert.strictEqual(Number, typeOf(Infinity));
        assert.strictEqual(Number, typeOf(NaN));
    });

    it('typeOf /w Boolean', function () {
        assert.strictEqual(Boolean, typeOf(true));
        assert.strictEqual(Boolean, typeOf(false));
    });

    it('typeOf /w String', function () {
        assert.strictEqual(String, typeOf(''));
    });

    it('typeOf /w Array', function () {
        assert.strictEqual(Array, typeOf([]));
    });

    it('typeOf /w Object', function () {
        assert.strictEqual(Object, typeOf({}));
    });

    it('typeOf /w Function', function () {
        assert.strictEqual(Function, typeOf(Array.isArray));
    });

    it('typeOf /w Date', function () {
        assert.strictEqual(Date, typeOf(new Date()));
    });

    it('typeOf /w RegExp', function () {
        assert.strictEqual(RegExp, typeOf(/[a-z]/));
    });
});
