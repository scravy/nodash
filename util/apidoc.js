/* vim: set et sw=2 ts=2: */
/* jshint node: true */
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
        fileFilter: N.async(N.compose(N.eq('.md'), path.extname))
    });

    var files = {};

    walker.on('file', function (file) {
        var topic = file.replace(/^doc\//, '');
        var group = path.dirname(topic);
        var name = path.basename(topic, '.md');

        if (!(name in N.__metadata)) {
            console.log(chalk.red('Warning:'), file, 'does not correspond to any function');
        }
    });

    walker.on('end', function (file) {
        
    });

    walker.walk(dir);


    N.pipe([

        N.idf(N),

        N.map(function (func, name) {

            return {
                
            };
        })

        // console.log

    ]);

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
