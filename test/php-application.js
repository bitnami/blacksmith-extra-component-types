'use strict';

const PHPApplication = require('../php-application');
const helpers = require('blacksmith/test/helpers');
const nfile = require('nami-utils').file;
const path = require('path');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('PHP Application', () => {
  let be;
  let log;
  let phpApplication;
  let test;

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
      const packageName = `${phpApplication.id}-${phpApplication.metadata.version}`;
      const composerFile = path.join(test.sandbox, packageName, 'composer.json');
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

  it('installs files to the target directory', () => {
    phpApplication.setup({be});
    phpApplication.cleanup();

    const filename = 'sourcefile.php';

    // Assert that the expected file does not exist
    const installedFile = path.join(test.prefix, `${phpApplication.id}`, filename);
    expect(installedFile).to.not.be.a.path();

    // Create an empty file within the sandbox working directory
    const sourceFile = path.join(test.sandbox, `${phpApplication.id}-${phpApplication.metadata.version}`, filename);
    nfile.touch(sourceFile);

    phpApplication.install();

    expect(installedFile).to.be.a.path();
  });
});
