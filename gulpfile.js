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
   ghPages = require('gulp-gh-pages'),
preprocess = require('gulp-preprocess'),
sourcemaps = require('gulp-sourcemaps'),
  markdown = require('gulp-markdown'),
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
      .pipe(sourcemaps.init())
      .pipe(preprocess())
      .pipe(uglify({ }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/'))
      .on('error', errorHandler)
      .on('finish', done);
});

gulp.task('gzip', [ 'minify' ], function (done) {
  gulp.src('dist/nodash.min.js')
      .pipe(gzip({ append: true, gzipOptions: { level: 9 } }))
      .pipe(gulp.dest('dist/'))
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
            .pipe(istanbul.writeReports({ dir: 'dist/coverage/' }))
            .on('finish', done);
    });
});

gulp.task('test', [ 'coverage' ], function (done) {
  gulp.src('.')
      .pipe(enforcer({
        thresholds: thresholds,
        coverageDirectory: 'dist/coverage/',
        rootDirectory: ''
      }))
      .on('error', errorHandler)
      .on('finish', done);
});

gulp.task('docco', [ 'lint' ], function (done) {
  gulp.src('nodash.js')
      .pipe(docco())
      .pipe(gulp.dest('dist/docco/'))
      .on('finish', done);
});

gulp.task('deploy', [ 'index' ], function () {
  return gulp.src('./dist/**/*')
      .pipe(ghPages({ }));
});

gulp.task('index', [ 'site' ], function (done) {
  gulp.src('site/index.html')
      .pipe(preprocess())
      .pipe(gulp.dest('dist/'))
      .on('finish', done);
});

gulp.task('site', [ 'default', 'docco' ], function (done) {
  gulp.src('README.md')
      .pipe(markdown())
      .pipe(gulp.dest('dist/'))
      .on('finish', done);
});

gulp.task('default', [ 'test', 'gzip', ]);

