// Generated on 2016-01-05 using generator-angular-fullstack 3.1.1
'use strict';

let _ = require('lodash');
let gulp = require('gulp');
let gulpLoadPlugins = require('gulp-load-plugins');
let lazypipe = require('lazypipe');
let nodemon = require('nodemon');
let runSequence = require('run-sequence');
let argv = require('yargs').argv;
let jscs = require('gulp-jscs');

let plugins = gulpLoadPlugins();
let config;

let paths = {
  server: {
    scripts: ['**/*.js', '!node_modules/**/*.js'],
    json: ['**/*.json'],
    test: [
      '**/*.spec.js',
      '**/*.mock.js',
      '**/*.integration.js',
      '!node_modules/**/*.js',
    ],
  },
  karma: 'karma.conf.js',
  dist: 'dist',
};

// /********************
//  * Env
//  ********************/

gulp.task('env:all', function () {
  let localConfig;
  try {
    localConfig = require('./config/local.env');
  } catch (e) {
    localConfig = {};
  }

  plugins.env({
    vars: localConfig,
  });
});

gulp.task('env:test', function () {
  plugins.env({
    vars: { NODE_ENV: 'test' },
  });
});

gulp.task('env:prod', function () {
  plugins.env({
    vars: { NODE_ENV: 'production' },
  });
});

// /********************
//  * Helper functions
//  ********************/

function onServerLog(log) {
  console.log(plugins.util.colors.white('[') +
    plugins.util.colors.yellow('nodemon') +
    plugins.util.colors.white('] ') +
    log.message);
}

// /********************
//  * Reusable pipelines
//  ********************/

let lintServerScripts = lazypipe()
  .pipe(plugins.jshint, '.jshintrc')
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

// /********************
//  * Env
//  ********************/

gulp.task('env:all', function () {
  let localConfig;
  try {
    localConfig = require('./config/local.env');
  } catch (e) {
    localConfig = {};
  }

  plugins.env({
    vars: localConfig,
  });
});

gulp.task('env:test', function () {
  plugins.env({
    vars: { NODE_ENV: 'test' },
  });
});

gulp.task('env:prod', function () {
  plugins.env({
    vars: { NODE_ENV: 'production' },
  });
});

// /********************
//  * Tasks
//  ********************/

gulp.task('scripts:lint', function () {
  return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, function (blob) {
      return '!' + blob;
    })))
    .pipe(lintServerScripts());
});

gulp.task('scripts:jscs', function () {
  return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, function (blob) {
      return '!' + blob;
    })))
    .pipe(jscs({ config: './.jscsrc' }))
    .pipe(jscs.reporter());
});

gulp.task('scripts', function (cb) {
  runSequence(
    'scripts:jscs',
    'scripts:lint',
    cb);
});

gulp.task('start:server', function () {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require('./config/environment');
  const isDebug = argv.debug ? '--debug' : '';
  nodemon('-w server ' + isDebug + ' server')
    .on('log', onServerLog);
});

gulp.task('watch', function () {
  let testFiles = paths.server.test;

  plugins.livereload.listen();

  plugins.watch(_.union(paths.server.scripts, testFiles))
    .pipe(plugins.plumber())
    .pipe(lintServerScripts())
    .pipe(plugins.livereload());
});

gulp.task('serve', function (cb) {
  runSequence(
    'scripts',
    'start:server',
    'watch',
    cb);
});

gulp.task('mocha:unit', function () {
  return gulp.src(paths.server.test)
    .pipe(plugins.mocha({
      reporter: 'spec',
      require: [
        './mocha.conf',
      ],
    }))
    .once('end', function () {
      process.exit();
    });
});

gulp.task('test', function (cb) {
  runSequence(
    'env:all',
    'env:test',
    'mocha:unit',
    cb);
});
