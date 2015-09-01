var P = require('../nodash').install(GLOBAL);
var assert = map(flip, require('assert'));
var expect = require('chai').expect;

describe('Data.Char', function () {

    it('ord', function () {
        assert.strictEqual(65, ord('A'));
    });

    it('chr', function () {
        assert.strictEqual('A', chr(65));
    });

    it('isUpper', function () {
        assert.strictEqual(true, isUpper('ABC'));
        assert.strictEqual(false, isUpper('ABdC'));
        assert.strictEqual(false, isUpper('def'));
    });
    
    it('isLower', function () {
        assert.strictEqual(true, isLower('xyz'));
        assert.strictEqual(false, isLower('ABdC'));
        assert.strictEqual(false, isLower('KLM'));
    });

});

