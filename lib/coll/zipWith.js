/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = function () {

  var Nodash = this;

  return {

    zipWith: function (f, as, bs) {
      var length = Math.min(as.length, bs.length);
      var zs = [];
      for (var i = 0; i < length; i++) {
        zs[i] = f(as[i], bs[i]);
      }
      return zs;
    },

    zipWith3: function (f, as, bs, cs) {
      var length = Nodash.minimum([as.length, bs.length, cs.length]);
      var zs = [];
      for (var i = 0; i < length; i++) {
        zs[i] = f(as[i], bs[i], cs[i]);
      }
      return zs;
    },

    zipWith4: function (f, as, bs, cs, ds) {
      var length = Nodash.minimum([as.length, bs.length, cs.length, ds.length]);
      var zs = [];
      for (var i = 0; i < length; i++) {
        zs[i] = f(as[i], bs[i], cs[i], ds[i]);
      }
      return zs;
    }
    
  };
};
