require('../nodash').install(GLOBAL);
var assert = map(flip, require('assert'));

describe('Streams', function () {

    it('keys', function () {
        var ks = keys({ a: 3, b: 2, c: 1 });
        assert.deepEqual(0, difference(ks, "abc").length);
        assert.deepEqual([ 'c' ], difference(ks, "ab"));
    });

});
