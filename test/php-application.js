'use strict';

const PHPApplication = require('../php-application');
const helpers = require('blacksmith-test');

describe('PHP Application', function() {
  before('prepare environment', () => {
    helpers.cleanTestEnv();
  });
  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });
  xit('builds a sample PHP application', () => {
  });
});
