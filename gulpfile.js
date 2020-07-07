'use strict';

const gulp = require('gulp');
const commonTasks = require('bitnami-gulp-common-tasks')(gulp);

/* CI tasks */

const testFiles = './test/*.js';
const srcFiles = [
  'index.js',
  'dokuwiki-plugin/*.js',
  'drupal-plugin/*.js',
  'go-project/*.js',
  'nginx-module/*.js',
  'node-application/*.js',
  'pecl-component/*.js',
  'php-application/*.js',
  'ruby-application/*.js',
  'wordpress-plugin/*.js',
  testFiles,
];
const testArgs = {sources: srcFiles, tests: testFiles};

commonTasks.test(testArgs);
commonTasks.ci(testArgs);

/* General tasks */

gulp.task('clean', ['test:clean']);
