/* vim: set et sw=2 ts=2: */
/* jshint node: true */
"use strict";

var thresholds = {
  statements: 0,
    branches: 0,
       lines: 0,
   functions: 0
};

var jshint = require('gulp-jshint'),
     mocha = require('gulp-mocha'),
  istanbul = require('gulp-istanbul'),
  enforcer = require('gulp-istanbul-enforcer'),
      gulp = require('gulp');

gulp.task('lint', function (done) {
  gulp.src([ 'prelude.js', 'test/*.js' ])
             .pipe(jshint())
             .pipe(jshint.reporter('default'))
             .pipe(jshint.reporter('fail'))
             .on('finish', done);
});

gulp.task('test', [ 'lint' ], function (done) {
  gulp.src('prelude.js')
      .pipe(istanbul())
      .pipe(istanbul.hookRequire()) 
      .on('finish', function () {
        gulp.src('test/*.js')
            .pipe(mocha())
            .pipe(istanbul.writeReports())
            .pipe(enforcer({
              thresholds: thresholds,
              coverageDirectory: 'coverage',
              rootDirectory: ''
            }))
            .on('end', done);
    });
});

gulp.task('default', [ 'test' ]);

