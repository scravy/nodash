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
  mustache = require('gulp-mustache'),
preprocess = require('gulp-preprocess'),
sourcemaps = require('gulp-sourcemaps'),
  markdown = require('gulp-markdown'),
  istanbul = require('gulp-istanbul'),
  enforcer = require('gulp-istanbul-enforcer'),
   replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
     docco = require('gulp-docco'),
      less = require('gulp-less'),
     chalk = require('chalk'),
      gzip = require('gulp-gzip'),
        fs = require('fs'),
    apidoc = require('./documentation.js'),
  filesize = require('filesize'),
      gulp = require('gulp');

var LessPluginAutoprefix = require('less-plugin-autoprefix');
var LessPluginCleanCSS = require('less-plugin-clean-css');

var lessOptions = {
  plugins: [
    new LessPluginAutoprefix({ browsers: [ "last 2 versions" ]}),
    new LessPluginCleanCSS({ advanced: true })
  ]
};

var npmPackage = require('./package.json');

function errorHandler(err) {
  console.log(chalk.red(err.message));
  process.exit(1);
}

gulp.task('minify', [ 'lint' ], function (done) {
  gulp.src('nodash.js')
      .pipe(sourcemaps.init())
      .pipe(preprocess())
      .pipe(uglify({ compressor: { global_defs: { group: true } } }))
      .pipe(replace(/(group\(('[^']*'|"[^"]*")(,function\(\)\{\})?\),?)/g, ""))
      .pipe(replace(/composed\(function\(\)\{return ([^}]+)\}\)/g, "$1"))
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
  gulp.src([ 'nodash.js', 'test/*.js', 'benchmark/*.js' ])
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

// test library as is
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

// test minified library
gulp.task('testm', [ 'test', 'minify' ], function (done) {
  gulp.src('test/*.js')
      .pipe(replace('../nodash', '../dist/nodash.min'))
      .pipe(gulp.dest('testm/'))
      .on('finish', function () {
        gulp.src('testm/*.js')
            .pipe(mocha())
            .on('error', errorHandler)
            .once('end', done);
      });
});

gulp.task('docco', [ 'lint' ], function (done) {
  gulp.src('nodash.js')
      .pipe(docco())
      .pipe(gulp.dest('dist/docco/'))
      .on('finish', done);
});

gulp.task('styles', function (done) {
  gulp.src('site/*.less')
      .pipe(less(lessOptions))
      .pipe(gulp.dest('dist/'))
      .on('finish', done);
});

gulp.task('apidoc', [ 'styles', 'lint' ], function (done) {
  var library = require('./nodash.js');

  gulp.src('site/apidoc.mustache')
      .pipe(mustache(apidoc(library.metadata)))
      .pipe(rename({ extname: ".html" }))
      .pipe(gulp.dest('dist/'))
      .on('finish', done);
});

gulp.task('site', [ 'build', 'docco', 'apidoc' ], function (done) {
  gulp.src('README.md')
      .pipe(markdown({ }))
      .pipe(gulp.dest('dist/'))
      .on('finish', function () {
        var variables = {
          MINIFIED_SIZE: filesize(fs.statSync('dist/nodash.min.js').size),
          GZIPPED_SIZE: filesize(fs.statSync('dist/nodash.min.js.gz').size),
          VERSION: npmPackage.version,
          TODAY: new Date().toISOString().substring(0, 10)
        };

        gulp.src('site/*.html')
            .pipe(preprocess({ context: variables }))
            .pipe(gulp.dest('dist/'))
            .on('finish', done);
      });
});

gulp.task('deploy', [ 'site' ], function () {
  return gulp.src('./dist/**/*')
      .pipe(ghPages({ }));
});

gulp.task('build', [ 'minify', 'testm', 'gzip' ]);

gulp.task('default', [ 'site', ], function (done) {

  var minified = filesize(fs.statSync('dist/nodash.min.js').size);

  console.log(chalk.white((function(){/*
  CHECKMARK Your library has been built, Sir!

  You can find the minified version in the dist/ folder
  (there's also some documentation in that folder).
  It passed all test cases and achieved a good code coverage.
  In total it is a whopping MINIFIED minified. Note that the
  minified version has also been dragged through all the test
  cases and passed without a doubt.
  */}).toString()
      .slice(14, -3)
      .replace("CHECKMARK", chalk.green("✓"))
      .replace("MINIFIED", chalk.yellow(minified))
  ));

});

