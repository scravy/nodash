var P = require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Data.Char', function () {

    it('ord', function () {
        assert.strictEqual(65, ord('A'));
    });

    it('chr', function () {
        assert.strictEqual('A', chr(65));
    });

    it('isUpper', function () {
        assert.strictEqual(true, isUpper('ABC'));
        assert.strictEqual(false, isUpper('HELLO_WORLD'));
        assert.strictEqual(false, isUpper('ABdC'));
        assert.strictEqual(false, isUpper('def'));
    });
    
    it('isLower', function () {
        assert.strictEqual(true, isLower('xyz'));
        assert.strictEqual(false, isLower('abc123'));
        assert.strictEqual(false, isLower('ABdC'));
        assert.strictEqual(false, isLower('KLM'));
    });

    it('isLetter', function () {
        assert.strictEqual(true, isLetter('a'));
        assert.strictEqual(true, isLetter('abc'));
        assert.strictEqual(true, isLetter('A'));
        assert.strictEqual(true, isLetter('ABC'));
        assert.strictEqual(false, isLetter('a9'));
        assert.strictEqual(false, isLetter('ab-c'));
        assert.strictEqual(false, isLetter(' '));
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

    it('isDigit /w "abc"', function () {
        assert.strictEqual(false, isDigit("abc"));
    });
    
    it('isDigit /w "abc456"', function () {
        assert.strictEqual(false, isDigit("abc456"));
    });

    it('isDigit /w "789"', function () {
        assert.strictEqual(true, isDigit("789"));
    });

});

