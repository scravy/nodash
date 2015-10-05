/* vim: set et sw=2 ts=2: */
'use strict';

var marked = require('marked');
var fs = require('fs');
var path = require('path');
var highlightjs = require('highlight.js');
var DirectoryWalker = require('directorywalker');
var N = require('../nodash');
var chalk = require('chalk');

marked.setOptions({
  highlight: function (code) {
    return highlightjs.highlight('js', code).value;
  }
});

module.exports = function (dir, callback) {

    var pkg = require('../package.json');

    var walker = new DirectoryWalker({
        fileFilter: N.async(N.compose(/./.test.bind(/\.(md|json|hs)$/), path.extname))
    });

    var functions = {};
    var groups = {};

    var errors = 0;

    N.each(function (func, name) {
        if (N[name]) {            
            functions[name] = {
                name: name,
                source: func.definition.toString()
            };
        }
    }, N.__metadata);

    walker.on('file', function (file) {

        var title = file.replace(/^doc\//, '');
        var name = path.basename(title, path.extname(title));
        var func = name.replace(/^_/, '');
        var group = path.dirname(title);

        groups[group] = groups[group] || {
            id: group,
            name: group,
            functions: {}
        };
        if (func !== 'index') {
            groups[group].functions[func] = null;
        }

        if (!(func in functions) && func !== 'index') {
            console.log(chalk.yellow('Warning:'), file, 'does not correspond to any function');
            errors += 1;
            return;
        }

        switch (path.extname(title)) {
            case '.hs':
                functions[func].haskellDef = fs.readFileSync(file, 'utf8');
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

        var gs = [];        
        N.each(function (group) {
            var fs = [];
            N.each(function (_, key) {
                var f = functions[key];
                f.aliases = [];
                N.__metadata[key].aliases.forEach(function (alias) {
                    if (alias !== f.name) {
                        f.aliases.push(alias);
                    }
                });
                fs.push(f);
            }, group.functions);
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
