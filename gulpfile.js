/* vim: set et sw=2 ts=2: */
/* jshint node: true */
"use strict";

var thresholds = {
  statements: 99,
    branches: 97,
   functions: 100,
       lines: 99
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

function errorHandler(err) {
  console.log(chalk.red(err.message));
  process.exit(1);
}

gulp.task('minify', [ 'lint' ], function (done) {
  gulp.src('prelude.js')
      .pipe(uglify({  }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('.'))
      .on('error', errorHandler)
      .on('finish', done);
});

gulp.task('gzip', [ 'minify' ], function (done) {
  gulp.src('prelude.min.js')
      .pipe(gzip({ append: true, gzipOptions: { level: 9 } }))
      .pipe(gulp.dest('.'))
      .on('finish', done);
});

gulp.task('lint', function (done) {
  gulp.src([ 'prelude.js', 'test/*.js' ])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'))
      .on('error', errorHandler)
      .on('finish', done);
});

gulp.task('coverage', [ 'lint' ], function (done) {
  gulp.src('prelude.js')
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
      .on('error', errorHandler)
      .on('finish', function () {
        gulp.src('test/*.js')
            .pipe(mocha())
            .pipe(istanbul.writeReports())
            .on('finish', done);
    });
});

gulp.task('test', [ 'coverage' ], function (done) {
  gulp.src('.')
      .pipe(enforcer({
        thresholds: thresholds,
        coverageDirectory: 'coverage',
        rootDirectory: ''
      }))
      .on('error', errorHandler)
      .on('finish', done);
});

gulp.task('default', [ 'test', 'gzip' ]);

