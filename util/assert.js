var assert = require('assert');

function flip(f) {
    return function (a, b) {
        return f(b, a);
    }
}

Object.keys(assert).forEach(function (key) {
    if (typeof (assert[key]) === 'function') {
        assert[key] = flip(assert[key]);
    }
});

module.exports = assert;
