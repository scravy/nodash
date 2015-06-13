/* vim: set et sw=2 ts=2: */
/* jshint node: true */
"use strict";

var thresholds = {
  statements: 99,
    branches: 98,
   functions: 100,
       lines: 99
};

var jshint = require('gulp-jshint'),
     mocha = require('gulp-mocha'),
preprocess = require('gulp-preprocess'),
  istanbul = require('gulp-istanbul'),
  enforcer = require('gulp-istanbul-enforcer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
     docco = require('gulp-docco'),
     chalk = require('chalk'),
      gzip = require('gulp-gzip'),
      gulp = require('gulp');

function errorHandler(err) {
  console.log(chalk.red(err.message));
  process.exit(1);
}

gulp.task('minify', [ 'lint' ], function (done) {
  gulp.src('nodash.js')
      .pipe(preprocess())
      .pipe(uglify({  }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('.'))
      .on('error', errorHandler)
      .on('finish', done);
});

gulp.task('gzip', [ 'minify' ], function (done) {
  gulp.src('nodash.min.js')
      .pipe(gzip({ append: true, gzipOptions: { level: 9 } }))
      .pipe(gulp.dest('.'))
      .on('finish', done);
});

gulp.task('lint', function (done) {
  gulp.src([ 'nodash.js', 'test/*.js' ])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'))
      .on('error', errorHandler)
      .on('finish', done);
});

gulp.task('coverage', [ 'lint' ], function (done) {
  gulp.src('nodash.js')
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

gulp.task('docco', [ 'lint' ], function (done) {
  gulp.src('nodash.js')
      .pipe(docco())
      .pipe(gulp.dest('docs/'));
});

gulp.task('default', [ 'test', 'gzip' ]);

