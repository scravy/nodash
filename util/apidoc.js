/* vim: set et sw=2 ts=2: */
/* jshint undef: false, maxcomplexity: 11, strict: false */

var marked = require('marked');
var fs = require('fs');
var path = require('path');
var highlightjs = require('highlight.js');
var DirectoryWalker = require('directorywalker');
var chalk = require('chalk');

var Nodash = require('../nodash');

Nodash.install(['_', global]);

function highlight(source, language) {
  return highlightjs.highlight(language || 'js', source).value;
}

var renderer = new marked.Renderer();

renderer.table = function (header, body) {
    return '<table class="table">' + header + body + '</table>';
};

marked.setOptions({
  highlight: highlight,
  gfm: true,
  renderer: renderer
});

function formatSource(func, name) {
  var source = func.toString();
  if (source.indexOf('__fn__') > -1) {
    return highlight('var ' + name + ' = /* this is a composed function */');
  }
  var sourceLines = _lines(source.replace(/Nodash\./g, ""));
  sourceLines[0] = sourceLines[0].replace(/^function +\(/, 'function ' + name + '(');
  var indent = _minimum(_map(_compose(_length, _takeWhile(_eq(' '))),
                         _filter(_compose(_not, _isEmpty), _tail(sourceLines))));
  return highlight(_unlines(_cons(_head(sourceLines), _map(_drop(indent), _tail(sourceLines)))));
}

function complianceWithHaskellPrelude() {
  var functions = _filter(
      _compose(_not, _isEmpty),
      _lines(fs.readFileSync('./doc/prelude.txt', 'utf8'))
  );

  var listFunctions = _filter(
      _compose(_not, _isEmpty),
      _lines(fs.readFileSync('./doc/data.list.txt', 'utf8'))
  );

  var breakUp = _map(_break(_eq(' ')));
  var functionsAndNotes = breakUp(functions);
  var listFunctionsAndNotes = breakUp(listFunctions);

  var functionsInPrelude = _map(_fst, functionsAndNotes);
  var functionsInDataList = _map(_fst, listFunctionsAndNotes);

  var allDesiredFunctions = _union(functionsInPrelude, functionsInDataList);

  var functionsInNodash = _concat(_map(_select('aliases'), _values(Nodash.__metadata)));

  var functionsInBoth = _intersect(functionsInPrelude, functionsInNodash);

  return _map(_sort, {
    
    allDesiredFunctions: allDesiredFunctions,

    functionsInPrelude: functionsInPrelude,

    functionsInBoth: functionsInBoth,
      
    functionsMissing:
      _difference(functionsInPrelude, functionsInNodash),
    
    functionsInNodashOnly:
      _keys(_filter(
          _compose(_not, _compose(_any(_flip(_elem)(allDesiredFunctions)), _select('aliases'))),
          Nodash.__metadata
      ))
  });
}

module.exports = function (dir, callback) {

    var pkg = require('../package.json');

    var walker = new DirectoryWalker({
        fileFilter: _async(_compose(/./.test.bind(/\.(md|json|hs)$/), path.extname))
    });

    var functions = {};
    var groups = {};
    var unclassified = {};

    var errors = 0;

    _each(function (func, name) {
        if (Nodash[name]) {
            functions[name] = {
                name: name,
                source: formatSource(func.definition, name)
            };
            unclassified[name] = true;
        }
    }, Nodash.__metadata);

    walker.on('file', function (file) {

        var title = file.replace(/^doc\//, '');
        var name = path.basename(title, path.extname(title));
        var func = name.replace(/^_/, '');
        var group = path.dirname(title);

        groups[group] = groups[group] || {
            id: group.replace(/[^a-z0-9]+/ig, '-'),
            name: group,
            functions: {}
        };
        if (func !== 'index') {
            groups[group].functions[func] = null;
            delete unclassified[func];
        }

        if (!(func in functions) && func !== 'index') {
            console.log(chalk.yellow('Warning:'), file, 'does not correspond to any function');
            errors += 1;
            return;
        }

        switch (path.extname(title)) {
            case '.hs':
                functions[func].haskellDef = highlight(fs.readFileSync(file, 'utf8').trim(), 'haskell');
                break;
            case '.json':
                try {
                    var description = JSON.parse(fs.readFileSync(file), 'utf8');
                    if (func === 'index') {
                        groups[group].groupMeta = description;
                    } else {
                        functions[func].meta = description;
                    }
                } catch (err) {
                    console.log(chalk.red('Error:', file, 'could not be parsed'));
                    console.log(chalk.gray(err));
                    errors += 1;
                }
                break;
            case '.md':
                try {
                    var data = marked(fs.readFileSync(file, 'utf8'));
                    if (func === 'index') {
                        groups[group].primer = data;
                    } else {
                        functions[func].documentation = data;
                    }
                } catch (err) {
                    console.log(chalk.red('Error:', file, 'can not be rendered'));
                    console.log(chalk.gray(err));
                    errors += 1;
                }
                break;
        }
    });

    walker.on('end', function () {
        
        if (errors) {
            throw new Error(errors + ' errors while processing doc directory `' + dir + '`');
        }

        groups['(unclassified)'] = {
          id: 'unclassified',
          name: '(unclassified)',
          functions: unclassified
        };

        pkg.coverageInfo = complianceWithHaskellPrelude();

        var gs = [];
        _each(function (group) {
            var fs = [];
            _each(function (key) {
                var f = functions[key];
                f.aliases = [];
                Nodash.__metadata[key].aliases.forEach(function (alias) {
                    if (alias !== f.name) {
                        f.aliases.push(alias);
                    }
                    var properAlias = alias.replace(/_$/, '');
                    if (_elem(properAlias, pkg.coverageInfo.allDesiredFunctions)) {
                        f.preludeName = properAlias;
                    }
                });
                fs.push(f);
            }, _sortBy(function (a, b) {
              return _compare(a.toLowerCase(), b.toLowerCase());
            }, _keys(group.functions)));
            group.functions = fs;

            gs.push(group);
        }, groups);
       
        pkg.groups = gs;

        setImmediate(callback.bind(null, null, pkg));
    });

    walker.walk(dir);

};

module.exports.complianceWithHaskellPrelude = complianceWithHaskellPrelude;
