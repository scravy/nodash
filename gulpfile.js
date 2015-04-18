/* vim: set et sw=2 ts=2: */
/* jshint node: true */
"use strict";

var thresholds = {
  statements: 50,
    branches: 50,
       lines: 50,
   functions: 50
};

var jshint = require('gulp-jshint'),
     mocha = require('gulp-mocha'),
  istanbul = require('gulp-istanbul'),
  enforcer = require('gulp-istanbul-enforcer'),
    minify = require('gulp-esmangle'),
    rename = require('gulp-rename'),
      gzip = require('gulp-gzip'),
      gulp = require('gulp');

gulp.task('minify', [ 'lint' ], function (done) {
  gulp.src('prelude.js')
      .pipe(minify({ legacy: false }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('.'))
      .on('finish', done);
});

gulp.task('gzip', [ 'minify' ], function (done) {
  gulp.src('prelude.min.js')
      .pipe(gzip({ append: true }))
      .pipe(gulp.dest('.'))
      .on('finish', done);
});

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

gulp.task('default', [ 'test', 'gzip' ]);

