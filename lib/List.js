/* vim: set et sw=2 ts=2: */

module.exports = [ 'Thunk', 'idf', function (Thunk, idf) {

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
  List.prototype.isEmpty = idf(false);

  var emptyList = new List();
  emptyList.isEmpty = idf(true);

  function arrayToString(array) {
    return array.join('');
  }
  
  function listToArray(xs) {
    if (Nodash.is(Thunk, xs)) {
      xs = xs.get();
    }
    var array = [];
    Nodash.each(function (x) {
      array.push(x);
    }, xs);
    return array;
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
    
    listToString: Nodash.compose(arrayToString, listToArray)

  };
}];
