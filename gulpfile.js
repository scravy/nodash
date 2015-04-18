/* vim: set et sw=2 ts=2: */
/* jshint node: true */
"use strict";

var thresholds = {
  statements: 80,
    branches: 60,
   functions: 60,
       lines: 80
};

var jshint = require('gulp-jshint'),
     mocha = require('gulp-mocha'),
  istanbul = require('gulp-istanbul'),
  enforcer = require('gulp-istanbul-enforcer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
     chalk = require('chalk'),
      gzip = require('gulp-gzip'),
      gulp = require('gulp');

process.on('uncaughtException', function (err) {
  console.log(chalk.red(err.message));
  process.exit(-1);
});

gulp.task('minify', [ 'lint' ], function (done) {
  gulp.src('prelude.js')
      .pipe(uglify({  }))
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

