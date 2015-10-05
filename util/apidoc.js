/* vim: set et sw=2 ts=2: */
'use strict';

var marked = require('marked');
var fs = require('fs');
var path = require('path');
var highlightjs = require('highlight.js');
var DirectoryWalker = require('directorywalker');
var N = require('../nodash');
var chalk = require('chalk');

function highlight(source, language) {
  return highlightjs.highlight(language || 'js', source).value;
}

marked.setOptions({
  highlight: highlight
});

function formatSource(func, name) {
  var source = N.lines(func.toString().replace(/Nodash\./g, ""));
  source[0] = source[0].replace(/^function +\(/, 'function ' + name + '(');
  var indent = N.minimum(N.map(N.compose(N.length, N.takeWhile(N.eq(' '))),
                         N.filter(N.compose(N.not, N.isEmpty), N.tail(source))));
  return highlight(N.unlines(N.cons(N.head(source), N.map(N.drop(indent), N.tail(source)))));
}

module.exports = function (dir, callback) {

    var pkg = require('../package.json');

    var walker = new DirectoryWalker({
        fileFilter: N.async(N.compose(/./.test.bind(/\.(md|json|hs)$/), path.extname))
    });

    var functions = {};
    var groups = {};
    var unclassified = {};

    var errors = 0;

    N.each(function (func, name) {
        if (N[name]) {
            functions[name] = {
                name: name,
                source: formatSource(func.definition, name)
            };
            unclassified[name] = true;
        }
    }, N.__metadata);

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
                        functions[func].description = data;
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

        var gs = [];
        N.each(function (group) {
            var fs = [];
            N.each(function (key) {
                var f = functions[key];
                f.aliases = [];
                N.__metadata[key].aliases.forEach(function (alias) {
                    if (alias !== f.name) {
                        f.aliases.push(alias);
                    }
                });
                fs.push(f);
            }, N.sortBy(function (a, b) {
              return N.compare(a.toLowerCase(), b.toLowerCase());
            }, N.keys(group.functions)));
            group.functions = fs;

            gs.push(group);
        }, groups);
        
        setImmediate(callback.bind(null, null, {
            version: pkg.version,
            groups: gs
        }));

    });

    walker.walk(dir);

};
