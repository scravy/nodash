if (!global.window) {
  global.window = {};
}

require('./dist/nodash.min');

module.exports = global.window.Nodash;
