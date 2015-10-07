/* vim: set et sw=2 ts=2: */
'use strict';

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
sourcemaps = require('gulp-sourcemaps'),
 filenames = require('gulp-filenames'),
  markdown = require('gulp-markdown'),
  istanbul = require('gulp-istanbul'),
  enforcer = require('gulp-istanbul-enforcer'),
   replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      less = require('gulp-less'),
      gzip = require('gulp-gzip'),
     docco = require('docco'),
     chalk = require('chalk'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
        fs = require('fs'),
browserify = require('browserify'),
  filesize = require('filesize'),
      gulp = require('gulp');

var LessPluginAutoprefix = require('less-plugin-autoprefix');
var LessPluginCleanCSS = require('less-plugin-clean-css');

var lessOptions = {
  plugins: [
    new LessPluginAutoprefix({ browsers: [ 'last 2 versions' ]}),
    new LessPluginCleanCSS({ advanced: true })
  ]
};

var npmPackage = require('./package.json');

var sources = [ 'nodash.js', 'lib/**/*.js' ];

function errorHandler(err) {
  console.log(chalk.red(err.message));
  process.exit(1);
}

gulp.task('browserify', [ 'lint' ], function (done) {
  browserify({
    entries: [ 'nodash.js' ]
  }).bundle()
    .pipe(source('nodash.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify({}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .on('error', errorHandler)
    .on('finish', done);
});

gulp.task('gzip', [ 'browserify' ], function (done) {
  gulp.src('dist/nodash.min.js')
      .pipe(gzip({ append: true, gzipOptions: { level: 9 } }))
      .pipe(gulp.dest('dist/'))
      .on('finish', done);
});

gulp.task('lint', function (done) {
  gulp.src([ 'nodash.js', 'lib/**/*.js', 'util/**/*.js', 'test/**/*.js', 'benchmark/*.js' ])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'))
      .on('error', errorHandler)
      .on('finish', done);
});

gulp.task('coverage', [ 'lint' ], function (done) {
  gulp.src(sources)
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
      .on('error', errorHandler)
      .on('finish', function () {
        gulp.src('test/**/*.js')
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

// test browserified + minified library
gulp.task('testm', [ 'test', 'browserify' ], function (done) {
  gulp.src('test/**/*.js')
      .pipe(replace('../nodash', '../nodash-testm'))
      .pipe(gulp.dest('testm'))
      .on('finish', function () {
        gulp.src('testm/**/*.js')
            .pipe(mocha())
            .on('error', errorHandler)
            .once('end', done);
      });
});

gulp.task('docco', [ 'lint' ], function (done) {
  gulp.src(sources)
      .pipe(filenames('javascript'))
      .pipe(gulp.dest('./dist/source'))
      .on('finish', function () {

        var args = [
          'node', 'docco',
          '-o', 'dist/docco',
          '-l', 'classic'
        ].concat(filenames.get('javascript', 'full'));

        docco.run(args);
        
        done();
      });
});

gulp.task('styles', function (done) {
  gulp.src('site/*.less')
      .pipe(less(lessOptions))
      .pipe(gulp.dest('dist/'))
      .on('finish', done);
});

gulp.task('apidoc', [ 'styles', 'lint' ], function (done) {
  var apidoc = require('./util/apidoc');

  apidoc('./doc', function (error, documentationData) {
    gulp.src('site/apidoc.mustache')
        .pipe(mustache(documentationData))
        .pipe(rename({ extname: ".html" }))
        .pipe(gulp.dest('dist/'))
        .on('finish', done);
  });

});

gulp.task('site', [ 'build', 'docco', 'apidoc' ], function (done) {
  gulp.src('README.md')
      .pipe(markdown({ }))
      .pipe(gulp.dest('dist/'))
      .on('finish', function () {
      
        npmPackage.readme = fs.readFileSync('./dist/README.html', 'utf8');
        npmPackage.minifiedSize = filesize(fs.statSync('dist/nodash.min.js').size);
        npmPackage.gzippedSize = filesize(fs.statSync('dist/nodash.min.js.gz').size);
        npmPackage.today = new Date().toISOString().substring(0, 10);

        gulp.src('site/*.html')
            .pipe(mustache(npmPackage))
            .pipe(gulp.dest('dist/'))
            .on('finish', done);
      });
});

gulp.task('deploy', [ 'site' ], function () {
  return gulp.src('./dist/**/*')
      .pipe(ghPages({ }));
});

gulp.task('build', [ 'browserify', 'testm', 'gzip' ]);

gulp.task('default', [ 'build', ], function (done) {

  var minified = filesize(fs.statSync('dist/nodash.min.js').size);
  var gzipped = filesize(fs.statSync('dist/nodash.min.js.gz').size);

  console.log(chalk.white((function(){/*
  CHECKMARK Your library has been built, Sir!

  You can find the minified version in the dist/ folder
  (there's also some documentation in that folder).
  It passed all test cases and achieved a good code coverage.
  In total it is a whopping MINIFIED minified (GZIPPED gzipped).
  Note that the minified version has also been dragged through
  all the test cases and passed without a doubt.
  */}).toString()
      .slice(14, -3)
      .replace('CHECKMARK', chalk.green('✓'))
      .replace('MINIFIED', chalk.yellow(minified))
      .replace('GZIPPED', chalk.yellow(gzipped))
  ));

});
