/* vim: set et sw=2 ts=2: */

var NativeSet = typeof Set !== 'undefined' && Set;

module.exports = NativeSet || (function () {
  
  var Set = function () {
    this.__xs = {};
  };

  Set.prototype.add = function add(value) {
    this.__xs[value] = true;
    return this;
  };

  Set.prototype.has = function has(value) {
    return this.__xs[value] === true;
  };

  return Set;
  
}());
