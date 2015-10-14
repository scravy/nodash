/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function (Nodash, options) {

  var curried = require('./curried');

  Nodash.__metadata = {};

  function id(x) { return x; }

  function registerLib(object) {
    Object.keys(object).forEach(function (key) {
      register(key, object[key]);
    });
  }

  var specialInjections = {
    Set:
      options.Set || (typeof Set !== 'undefined' && Set || require('./Set')),

    Math:
      options.Math || Math,

    error:
      function (Err, message) {
        throw new Err(message);
      },

    freeze:
      Object.freeze || id,

    create:
      Object.create || id,

    id:
      id
  };

  function registerInjected(array) {
    var func = array.pop();
    var args = [];
    array.forEach(function (arg) {
      args.push(arg in specialInjections ? specialInjections[arg] : Nodash[arg]);
    });
    register(func.apply(Nodash, args));
  }

  function register() {
    var args = [].slice.call(arguments);
    
    if (arguments.length === 1) {
      switch (typeof args[0]) {
      case 'object':
        if (Array.isArray(args[0])) {
          registerInjected(args[0].slice());
        } else {
          registerLib(args[0]);
        }
        break;
      case 'function':
        register(args[0].call(Nodash));
        break;
      }
      return;
    }
    var func = args.pop();
    var aliases = [];
    args.forEach(function (arg) {
      [].push.apply(aliases, arg.split(/ +/));
    });
    var name = null;
    for (var i = 0; i < aliases.length; i += 1) {
      if (/^[a-z0-9]+$/i.test(aliases[i])) {
        name = aliases[i];
        break;
      }
    }
    Nodash.__metadata[name] = {
      aliases: aliases,
      definition: func 
    };
    if (!/^[A-Z]/.test(name)) {
      func = curried(func);
    }
    aliases.forEach(function (alias) {
      Nodash[alias] = func;
    });
  }

  return register;
};
