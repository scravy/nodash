/* vim: set et sw=2 ts=2: */

function makeNodash(options) {
  'use strict';

  options = options || {};

  // Basic ECMA Script 5 checks (if these fail pull in `es5-shim`).

  if (typeof Object.keys !== 'function' || Object.keys({ x: 7 })[0] !== 'x') {
    throw new Error('ES5 `Object.keys` required (es5-shim will do).');
  }
  if (typeof Array.isArray !== 'function' || !Array.isArray([])) {
    throw new Error('ES5 `Array.isArray` required (es5-shim will do).');
  }
  if (typeof Array.prototype.forEach !== 'function') {
    throw new Error('ES5 `Array.prototype.forEach` required (es5-shim will do).');
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
  register(require('./lib/collection'));


  // RealFloat

  /* ... */


  /* Maybe */

  register('maybe', function _maybe(def, fun, maybe) {
    if (maybe === undefined || maybe === null) {
      return def;
    }
    return fun(maybe);
  });

  register('isJust', function _isJust(value) {
    return value !== undefined && value !== null;
  });

  register('isNothing', function _isNothing(value) {
    return value === undefined || value === null;
  });

  register('fromMaybe', function _fromMaybe(def, maybe) {
    if (maybe === undefined || maybe === null) {
      return def;
    }
    return maybe;
  });

  register('listToMaybe', function _listToMaybe(xs) {
    return xs[0];
  });

  register('maybeToList', function _maybeToList(maybe) {
    if (maybe === undefined || maybe === null) {
      return [];
    }
    return [maybe];
  });

  register('catMaybes', Nodash.filter(Nodash.isJust));

  register('mapMaybe', Nodash.compose2(Nodash.filter(Nodash.isJust), Nodash.map));


  /* Either */

  register('either', function _either(afun, bfun, either) {
    var left = either.left || either[0];
    if (left) {
      return afun(left);
    }
    var right = either.right || either[1];
    if (right) {
      return bfun(right);
    }
    return null;
  });

  register('Left', function _Left(value) {
    return { left: value };
  });

  register('Right', function _Right(value) {
    return { right: value };
  });

  register('isLeft', function _isLeft(val) {
    return val.left !== undefined ||
      (val[0] !== undefined && val[0] !== null);
  });

  register('isRight', function _isRight(val) {
    return (val.right !== undefined || val[1] !== undefined) &&
      !Nodash.isLeft(val);
  });

  register('fromLeft', function _fromLeft(val) {
    if (val.left !== undefined) {
      return val.left;
    }
    return val[0];
  });

  register('fromRight', function _fromRight(val) {
    if (val.right !== undefined) {
      return val.right;
    }
    return val[1];
  });

  register('lefts', Nodash.compose(
              Nodash.map(Nodash.fromLeft),
              Nodash.filter(Nodash.isLeft)
  ));

  register('rights', Nodash.compose(
              Nodash.map(Nodash.fromRight),
              Nodash.filter(Nodash.isRight)
  ));

  register('partitionEithers', function _partitionEithers(xs) {
    return Nodash.tuple(Nodash.lefts(xs), Nodash.rights(xs));
  });


  // group('Nodash');

  register('isNodash', function (thing) { return !!thing.__isNodash; });

  register('install', function _install(mountpoint) {
    var options = arguments[1];
    var nodashObject = Nodash;
    var prefix = '';
    var postfix = '';
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
      if (!Nodash.isNodash(func)) {
        return;
      }
      mountpoint[prefix + name + postfix] = func;
    }, nodashObject);
    return mountpoint;
  });

  return Nodash;
}

var Nodash = makeNodash();

module.exports = Nodash;

if (typeof window !== 'undefined') {
  window.Nodash = Nodash;
}
