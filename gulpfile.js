// Generated on 2016-01-05 using generator-angular-fullstack 3.1.1
'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var path = require('path');
var gulpLoadPlugins = require('gulp-load-plugins');
var http = require('http');
var lazypipe = require('lazypipe');
var nodemon = require('nodemon');
var runSequence = require('run-sequence');

var plugins = gulpLoadPlugins();
var config;

gulp.task('default', function () {
  console.log('gulping');
});

var paths = {
  server: {
    scripts: ['server/**/*.js'],
    json: ['server/**/*.json'],
    test: [
      'server/**/*.spec.js',
      'server/**/*.mock.js',
      'server/**/*.integration.js'
    ]
  },
  karma: 'karma.conf.js',
  dist: 'dist'
};

// /********************
//  * Env
//  ********************/

gulp.task('env:all', function () {
  let localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  }
  plugins.env({
    vars: localConfig
  });
});

gulp.task('env:test', function () {
  plugins.env({
    vars: {NODE_ENV: 'test'}
  });
});

gulp.task('env:prod', function () {
  plugins.env({
    vars: {NODE_ENV: 'production'}
  });
});

// /********************
//  * Helper functions
//  ********************/

function onServerLog (log) {
  console.log(plugins.util.colors.white('[') +
    plugins.util.colors.yellow('nodemon') +
    plugins.util.colors.white('] ') +
    log.message);
}

// /********************
//  * Reusable pipelines
//  ********************/

var lintServerScripts = lazypipe()
  .pipe(plugins.jshint, 'server/.jshintrc')
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

// /********************
//  * Env
//  ********************/

gulp.task('env:all', function () {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  }
  plugins.env({
    vars: localConfig
  });
});

gulp.task('env:test', function () {
  plugins.env({
    vars: {NODE_ENV: 'test'}
  });
});

gulp.task('env:prod', function () {
  plugins.env({
    vars: {NODE_ENV: 'production'}
  });
});

// /********************
//  * Tasks
//  ********************/

gulp.task('lint:scripts', function () {
  console.log('linting scripts');
  return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, function (blob) {
      return '!' + blob;
    })))
    .pipe(lintServerScripts());
});

gulp.task('start:server', function () {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require('./server/config/environment');
  nodemon('-w server server')
    .on('log', onServerLog);
});

gulp.task('watch', function () {
  var testFiles = paths.server.test;

  plugins.livereload.listen();

  plugins.watch(_.union(paths.server.scripts, testFiles))
    .pipe(plugins.plumber())
    .pipe(lintServerScripts())
    .pipe(plugins.livereload());
});

gulp.task('serve', function (cb) {
  runSequence(
    'lint:scripts',
    'start:server',
    'watch',
    cb);
});

gulp.task('mocha:unit', function () {
  return gulp.src(paths.server.test)
    .pipe(plugins.mocha({
      reporter: 'spec',
      require: [
        './mocha.conf'
      ]
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
