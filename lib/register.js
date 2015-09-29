/* vim: set et sw=2 ts=2: */

module.exports = function (Nodash) {

  var curried = require('./curried');

  function registerLib(object) {
    Object.keys(object).forEach(function (key) {
      register(key, object[key]);
    });
  }

  function registerInjected(array) {
    var func = array.pop();
    var args = [];
    array.forEach(function (arg) {
      args.push(Nodash[arg]);
    });
    register(func.apply(Nodash, args));
  }

  function register() {
    var args = [].slice.call(arguments);
    
    if (arguments.length === 1) {
      if (Array.isArray(args[0])) {
        registerInjected(args[0]);
      } else if (typeof args[0] === 'object') {
        registerLib(args[0]);
      } else if (typeof args[0] === 'function') {
        register(args[0].call(Nodash));
      }
      return;
    }
    var func = args.pop();
    var aliases = [];
    args.forEach(function (arg) {
      [].push.apply(aliases, arg.split(/ +/));
    });
    if (!/^[A-Z]/.test(aliases[0])) {
      func = curried(func);
    }
    func.__isNodash = true;
    aliases.forEach(function (alias) {
      Nodash[alias] = func;
    });
  }

  return register;
};
