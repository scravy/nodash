var assert = require('assert');

describe('Tasks', function () {

    it('run', function (done) {
        var P = require('../nodash').install({}, null, null, null, true);
        var invocations = 0;
        P.run({
            eins: function (callback) {
                invocations += 1;
                callback(1);
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: ['eins', 'vier', function (eins, vier, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                assert.strictEqual(4, vier);
                callback(3);
            }],
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                callback(4);
            }]
        }, function (results) {
            assert.strictEqual(4, invocations);
            done();
        });
    });

    it('run /w exception', function (done) {
        var P = require('../nodash').install();
        var invocations = 0;
        P.run({
            eins: function (callback) {
                invocations += 1;
                callback(1);
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: ['eins', 'vier', function (eins, vier, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                assert.strictEqual(4, vier);
                callback(3);
            }],
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                throw new Error('Aww Snap!');
            }]
        }, function (results) {
            assert.strictEqual(3, invocations);
            done();
        });
    });


});
