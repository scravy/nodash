require('../nodash').install(GLOBAL);
var assert = require('assert');

describe('Tasks', function () {

    it('run (waterfall)', function (done) {
        var P = require('../nodash').install({}, null, null, null, true);
        var invocations = 0;
        P.run([
            function (callback) {
                invocations += 1;
                callback(1);
            },
            function (data, callback) {
                invocations += 1;
                assert.strictEqual(1, data);
                callback(2);
            },
            function (data, callback) {
                invocations += 1;
                assert.strictEqual(2, data);
                callback(3);
            },
            function (data, callback) {
                invocations += 1;
                assert.strictEqual(3, data);
                callback(4);
            }
        ], function (results) {
            assert.deepEqual({ 3: { result: 4 } }, results);
            assert.strictEqual(4, invocations);
            done();
        });
    });

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

    it('run /w exception + .runOnError', function (done) {
        var P = require('../nodash').install();
        var invocations = 0;
        P.run({
            eins: {
              func: function (callback) {
                invocations += 1;
                callback(1);
              }
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: ['eins', 'vier', {
              func: function (eins, vier, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                assert.strictEqual(4, vier);
                callback(3);
              },
              runOnError: true
            }],
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                throw new Error('Aww Snap!');
            }]
        }, function (results) {
            assert.strictEqual(4, invocations);
            done();
        });
    });

    it('run /w exception + .runOnError (function identity)', function (done) {
        var P = require('../nodash').install();
        var invocations = 0;
        P.run({
            eins: {
              func: function (callback) {
                invocations += 1;
                callback(1);
              }
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: ['eins', 'vier', {
              func: function (eins, vier, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                assert.strictEqual(4, vier);
                callback(3);
              },
              runOnError: P.id
            }],
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                throw new Error('Aww Snap!');
            }]
        }, function (results) {
            assert.strictEqual(4, invocations);
            done();
        });
    });

    it('run /w exception + .runOnError (return missing)', function (done) {
        var P = require('../nodash').install();
        var invocations = 0;
        P.run({
            eins: {
              func: function (callback) {
                invocations += 1;
                callback(1);
              }
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: ['eins', 'vier', {
              func: function (eins, vier, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                assert.strictEqual(4, vier);
                callback(3);
              },
              runOnError: function (results) {
                  
              }
            }],
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                throw new Error('Aww Snap!');
            }]
        }, function (results) {
            assert.strictEqual(4, invocations);
            done();
        });
    });

    it('run /w async', function (done) {
        run({
            eins: function (callback) {
                callback(2);
            },
            zwei: [ 'eins', async(plus(3)) ]
        }, function (results) {
            assert.strictEqual(5, results.zwei.result);
            done();
        });
    });

    it('run /w async + exception', function (done) {
        run({
            eins: function (callback) {
                callback(2);
            },
            zwei: [ 'eins', async(function () { throw "error"; }) ]
        }, function (results) {
            assert.strictEqual("error", results.zwei.error);
            done();
        });
    });
});
