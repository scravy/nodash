/* vim: set et sw=2 ts=2: */
/* jshint node: true */
var marked = require('marked');

module.exports = function (library) {
  var groups = {};
  library.metadata.forEach(function (meta) {
    for (var i = 0; i < meta.aliases.length; i += 1) {
      meta.aliases[i] = { name: meta.aliases[i], isName: false };
      if (!meta.name && /^[a-zA-Z]/.exec(meta.aliases[i].name)) {
        meta.name = meta.aliases[i].name;
        meta.aliases[i].isName = true;
      }
    }
    if (meta.description) {
      meta.description = marked(meta.description);
    }
    if (!meta.name) {
      return;
    }
    if (!groups[meta.group.name]) {
      groups[meta.group.name] = meta.group;
      groups[meta.group.name].functions = [];
    }
    groups[meta.group.name].functions.push(meta);
  });
  var sortBy = function (f, xs) {
    return library.sortBy(library.on(library.compare, f), xs);
  };
  var result = { groups: [] };
  library.each(function (group) {
    result.groups.push({
      id: group.name.replace('[^a-zA-Z]+', ''),
      name: group.name,
      primer: marked(group.description),
      functions: sortBy(function (f) {
        return f.name.toLowerCase();
      }, group.functions)
    });
  }, groups);
  result.groups = sortBy(function (f) {
    return f.name;
  }, result.groups);
  return result;
};

