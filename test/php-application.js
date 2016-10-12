'use strict';

const PHPApplication = require('../php-application');
const helpers = require('blacksmith-test');
const nfile = require('nami-utils').file;
const path = require('path');
const chai = require('chai');
const expect = chai.expect;

describe('PHP Application', () => {
  var be;
  var log;
  var phpApplication;
  var test;

  beforeEach('prepare environment', () => {
    helpers.cleanTestEnv();
    log = {};
    test = helpers.createTestEnv();
    const component = helpers.createComponent(test);
    helpers.createDummyExecutable(path.join(test.prefix, 'php/bin/php'));
    helpers.createDummyExecutable(path.join(test.prefix, 'php/bin/composer'));
    phpApplication = new PHPApplication({
      id: component.id,
      version: component.version,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    }, {logger: helpers.getDummyLogger(log)});
    phpApplication.id = component.id;
    phpApplication.sourceTarball = component.sourceTarball;
    be = helpers.getDummyBuildEnvironment(test);
  });

  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });

  context('when composer.json present', () => {
    it('builds', () => {
      phpApplication.setup({be});
      phpApplication.cleanup();

      // Create an empty composer.json file
      const composerFile = path.join(test.sandbox, `${phpApplication.id}-${phpApplication.metadata.version}`, 'composer.json');
      nfile.touch(composerFile);

      phpApplication.install();
      expect(log.text).to.contain('composer install');
    });
  });

  context('when composer.json not present', () => {
    it('does not build', () => {
      phpApplication.setup({be});
      phpApplication.cleanup();
      phpApplication.install();
      expect(log.text).to.not.contain('composer install');
    });
  });
});
