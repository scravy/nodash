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

    var groupsMarkdown = {};
    var groupsJsondata = {};
    
    var markdown = {};
    var jsondata = {};
    var haskellDefs = {};

    var functions = {};
    var groups = {};

    var errors = 0;

    walker.on('file', function (file) {

        var title = file.replace(/^doc\//, '');
        var name = path.basename(title, path.extname(title));
        var func = name.replace(/^_/, '');
        var group = path.dirname(title);

        groups[group] = groups[group] || {
            id: group,
            name: group,
            functions: []
        };
        groups[group].functions.push(func);

        functions[func] = functions[func] || {
            name: func
        };

        if (!(func in N.__metadata) && func !== 'index') {
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
                        groupsJsondata[group].groupMeta = description;
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
        
        N.pipe([

            N.idf(N.__metadata),

            N.map(function (func, name) {

                return {
                    name: name
                };
            }),

            N.id
            //console.log

        ]);
    });

    walker.walk(dir);


    setImmediate(callback.bind(null, null, {
        version: pkg.version,
        groups: [
            {
                id: 'group',
                name: 'Group',
                primer: '[PRIMER]',
                functions: [
                    {
                        name: 'function',
                        aliases: [ 'one', 'two', 'three' ],
                        description: '[DESCRIPTION]',
                        source: '[SOURCE]'
                    }
                ]
            }
        ]
    }));

};
