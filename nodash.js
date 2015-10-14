/* vim: set et sw=2 ts=2: */

function makeNodash(options) {
  'use strict';

  options = options || {};

  // Basic ECMA Script 5 checks (if these fail pull in `es5-shim`).
  if (typeof Object.keys !== 'function' || Object.keys({ x: 7 })[0] !== 'x' ||
      typeof Array.isArray !== 'function' || !Array.isArray([]) ||
      typeof Array.prototype.forEach !== 'function') {
    throw new Error('ES5 environment required (`es5-shim` will do).');
  }

  // This is the object the nodash functions will be attached to.
  var Nodash = {};
  
  var register = require('./lib/register')(Nodash, options);

  register('curried', require('./lib/curried'));

  register(require('./lib/type'));
  register(require('./lib/function'));
  
  register(require('./lib/Thunk'));
  register(require('./lib/Tuple'));
  register(require('./lib/List'));
  register(require('./lib/Stream'));

  register(require('./lib/boolean'));
  register(require('./lib/eq'));
  register(require('./lib/ord'));
  register(require('./lib/char'));
  register(require('./lib/num'));
  register(require('./lib/integral'));
  register(require('./lib/fractional'));
  register(require('./lib/floating'));
  register(require('./lib/realfrac'));
  register(require('./lib/numeric'));
  register(require('./lib/string'));
  register(require('./lib/control'));
  register(require('./lib/object'));
  register(require('./lib/match'));

  register(require('./lib/coll/map'));
  register(require('./lib/coll/fold'));
  register(require('./lib/coll/base'));
  register(require('./lib/coll/zipWith'));
  register(require('./lib/coll/extra'));
  register(require('./lib/collection'));
  
  register(require('./lib/Maybe'));
  register(require('./lib/Either'));

  
  register('install', function (mountpoint) {
    var options = arguments[1];
    var nodashObject = Nodash;
    var prefix = '';
    var postfix = '';
    if (!mountpoint) {
      return Nodash;
    }
    if (options) {
      nodashObject = makeNodash(options);
    }
    if (Nodash.isArray(mountpoint)) {
      if (Nodash.isString(mountpoint[0])) {
        prefix = [].shift.call(mountpoint);
      }
      if (Nodash.isString(mountpoint[1])) {
        postfix = mountpoint[1];
      }
      mountpoint = mountpoint[0] || {};
    }
    Nodash.each(function (func, name) {
      if (name[0] === '_') {
        return;
      }
      var key = prefix + name + postfix;
      if (!(key in mountpoint)) {
        mountpoint[key] = func;
      }
    }, nodashObject);
    return mountpoint;
  });

  register('register', register);

  delete Nodash.Thunk;
  delete Nodash.resolveThunk;
  
  register(['freeze', function (freeze) {
    freeze(Nodash); return {};
  }]);
  
  return Nodash;
}

var Nodash = makeNodash();

module.exports = Nodash;

if (typeof window !== 'undefined') {
  window.Nodash = Nodash;
}
