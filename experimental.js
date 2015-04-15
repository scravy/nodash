
function enums() {
    var enums = {};
    for (var i = 0; i < arguments.length; i++) {
        enums[arguments[i]] = enums[i] = new Enum(i, arguments[i], enums);
    }
    return enums;
}

function Enum(index, value, enums) {
    this.index = index;
    this.value = value;
    this.enums = enums;
}

Enum.prototype.toString = function() {
    return this.value;
}

Enum.prototype.toInt = function() {
    return this.index;
}

