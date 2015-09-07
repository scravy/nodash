require('../nodash').install(GLOBAL);
var assert = require('../util/assert');

describe('Objects', function () {

    it('keys', function () {
        var ks = keys({ a: 3, b: 2, c: 1 });
        assert.deepEqual(0, difference(ks, "abc").length);
        assert.deepEqual([ 'c' ], difference(ks, "ab"));
    });

    [
        undefined,
        null,
        1,
        true,
        Math.PI,
        [],
        {},
        [ 1, 2, 3 ],
        { a: [], b: [ 4, 5, 6 ]}
    ]
    .forEach(function (data) {
        it('clone /w ' + data, function () {
            assert.deepEqual(data, clone(data));
        });
    });

    it('values', function () {
        assert.deepEqual([ 1, 1, 1], values({ a: 1, b: 1, c: 1 }));
    });
});
