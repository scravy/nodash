/* vim: set et sw=2 ts=2: */
'use strict';

module.exports = [ 'Thunk', 'idf', 'freeze', 'create',
  function (Thunk, idf, freeze, create) {

  var Nodash = this;

  function List(head, tail) {
    var self = this;
    this.head = function () {
      if (Nodash.is(Thunk, head)) {
        var value = head.get();
        self.head = head.get;
        return value;
      }
      return head;
    };
    this.tail = function () {
      if (Nodash.is(Thunk, tail)) {
        var value = tail.get();
        self.tail = tail.get;
        return value;
      }
      return tail;
    };
  }
  List.__type = 'list';
  List.prototype.isEmpty = idf(false);
  List.prototype.toString = function () {
    return '[object List ' + listToArray(this) + ']';
  };
  List.prototype.forEach = function (f) {
    var xs = this;
    while (!xs.isEmpty()) {
      f(xs.head());
      xs = xs.tail();
    }
  };

  var emptyList = new List();
  emptyList.isEmpty = idf(true);

  List.emptyList = emptyList;

  freeze(emptyList);
  freeze(List);

  function arrayToString(array) {
    return array.join('');
  }
  
  function listToArray(xs) {
    var array = [];
    Nodash.each(function (x) {
      array.push(x);
    }, xs);
    return array;
  }

  function rangeStep(step, from, to) {
    step = from < to ? step : -step;
    to = step > 0 ? Math.floor(to) : Math.ceil(to);
    var current = from;
    function gen() {
      current += step;
      return new List(current, current === to ? emptyList : new Thunk(gen));
    }
    return new List(from, new Thunk(gen));
  }

  return {

    List: List,

    singleton: function (thing) {
      return new List(thing, emptyList);
    },

    emptyList: function () {
      return emptyList;
    },

    arrayToString: arrayToString,

    listToArray: listToArray,
    
    listToString: Nodash.compose(arrayToString, listToArray),

    rangeStep: rangeStep,

    '.. range': function (from, to) {
      return rangeStep(1, from, to);
    }
  };
}];
