/* vim: set et sw=2 ts=2: */
/* jshint node: true */
var marked = require('marked');
var pkg = require('./package.json');
var fs = require('fs');
var highlightjs = require('highlight.js');

require('./nodash').install(GLOBAL);

marked.setOptions({
  highlight: function (code) {
    return highlightjs.highlight('js', code).value;
  }
});

function formatSource(m) {
  var func = m.function;
  if (func.composed) {
    return func.composed.toString().slice(19, -2).replace(/Nodash\./g, "");
  }
  if (!func.name) {
    return "";
  }
  var source = lines(func.toString());
  source[0] = "  " + source[0];
  var indent = minimum(map(compose(length, takeWhile(eq(' '))),
                           filter(compose(not, isEmpty), source)));
  return unlines(map(drop(indent), source));
}

module.exports = function (metadata) {
 
  var groups = pipe([

    idf(metadata),
    
    map(function (m) {
      var name = head(filter(compose(isAsciiLetter, fst), stream(m.aliases)));
      return {
        group: m.group,
        name: name,
        aliases: difference(m.aliases, [name]),
        arity: m.function.length,
        source: highlightjs.highlight('js', formatSource(m)).value,
        description: marked(m.description || "")
      };
    }),

    sortBy(on(compare, select("group.name"))),

    groupBy(on(eq, select("group.name"))),

    map(function (fs) {
      var group = head(fs).group;
      return {
        id: filter(isAsciiLetter, group.name),
        name: group.name,
        primer: marked(group.description || ""),
        functions: sortBy(on(compare, select("name")), fs)
      };
    })
  
  ]);

  pkg.groups = groups;
  
  return pkg;
};
