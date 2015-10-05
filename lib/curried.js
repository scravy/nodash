/* vim: set et sw=2 ts=2: */
'use strict';

function id(x) { return x; }

// **Partial application**
//
// While partial application of functions can be implemented easily
// using JavaScript's `bind` or `apply` functions, it is more
// efficient to use closures as JavaScript's native functions
// additionally do some heavy error checking and deal with `this`.
//
// Partial application of functions relies on the `length` reported
// by a function. A correct partial application returns a function
// with a length
// `length of function which is applied MINUS number of arguments consumed`.
// Unfortunately this means we need to have some biolerplate code for
// every arity of functions and results, thus the big blob of code
// below.
var funcs = {

0: id,
1: id,
2: function (__fn__) {
  return function (a, b) {
    switch (arguments.length) {
    case 1:
      return function (b) {
        return __fn__(a, b);
      };
    }
    return __fn__(a, b);
  };
},
3: function (__fn__) {
  return function (a, b, c) {
    switch (arguments.length) {
    case 1:
      return funcs[2](function (b, c) {
        return __fn__(a, b, c);
      });
    case 2:
      return function (c) {
        return __fn__(a, b, c);
      };
    }
    return __fn__(a, b, c);
  };
},
4: function (__fn__) {
  return function (a, b, c, d) {
    switch (arguments.length) {
    case 1:
      return funcs[3](function (b, c, d) {
        return __fn__(a, b, c, d);
      });
    case 2:
      return funcs[2](function (c, d) {
        return __fn__(a, b, c, d);
      });
    case 3:
      return function (d) {
        return __fn__(a, b, c, d);
      };
    }
    return __fn__(a, b, c, d);
  };
},
5: function (__fn__) {
  return function (a, b, c, d, e) {
    switch (arguments.length) {
    case 1:
      return funcs[4](function (b, c, d, e) {
        return __fn__(a, b, c, d, e);
      });
    case 2:
      return funcs[3](function (c, d, e) {
        return __fn__(a, b, c, d, e);
      });
    case 3:
      return funcs[2](function (d, e) {
        return __fn__(a, b, c, d, e);
      });
    case 4:
      return function (e) {
        return __fn__(a, b, c, d, e);
      };
    }
    return __fn__(a, b, c, d, e);
  };
},
6: function (__fn__) {
  return function (a, b, c, d, e, f) {
    switch (arguments.length) {
    case 1:
      return funcs[5](function (b, c, d, e, f) {
        return __fn__(a, b, c, d, e, f);
      });
    case 2:
      return funcs[4](function (c, d, e, f) {
        return __fn__(a, b, c, d, e, f);
      });
    case 3:
      return funcs[3](function (d, e, f) {
        return __fn__(a, b, c, d, e, f);
      });
    case 4:
      return funcs[2](function (e, f) {
        return __fn__(a, b, c, d, e, f);
      });
    case 5:
      return function (f) {
        return __fn__(a, b, c, d, e, f);
      };
    }
    return __fn__(a, b, c, d, e, f);
  };
}
};

// Turns an ordinary function into a function which can be partially applied.
// The maximum arity that this can deal with is 8 (see above).
module.exports = function curried(fn) {
  return funcs[fn.length](fn);
};
