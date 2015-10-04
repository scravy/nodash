/* vim: set et sw=2 ts=2: */
/* jshint node: true */
var marked = require('marked');
var pkg = require('../package.json');
var fs = require('fs');
var highlightjs = require('highlight.js');
var DirectoryWalker = require('directorywalker');
var Nodash = require('../nodash');

marked.setOptions({
  highlight: function (code) {
    return highlightjs.highlight('js', code).value;
  }
});

module.exports = function () {
    
    var walker = new DirectoryWalker();
    
    
    
    
    return {
        groups: [
            {
                id: 'group',
                name: 'Group',
                primer: '<<<PRIMER>>>',
                functions: [
                    {
                        name: 'function',
                        aliases: [ 'one', 'two', 'three' ],
                        description: '<<<DESCRIPTION>>>',
                        source: '<<<SOURCE>>>'
                    }
                ]
            }
        ]
    };

};
