'use strict';

const _ = require('lodash');
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
  let test;

  function createTestRecipe(recipeClass) {
    const component = helpers.createComponent(test);
    const phpApplication = new recipeClass({
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
    return phpApplication;
  }
  beforeEach('prepare environment', () => {
    helpers.cleanTestEnv();
    log = {};
    test = helpers.createTestEnv();
    helpers.createDummyExecutable(path.join(test.prefix, 'php/bin/php'));
    helpers.createDummyExecutable(path.join(test.prefix, 'php/bin/composer'));
    be = helpers.getDummyBuildEnvironment(test);
  });

  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });

  context('when composer.json present', () => {
    it('builds', () => {
      const phpApplication = createTestRecipe(PHPApplication);
      phpApplication.setup({be});
      phpApplication.cleanup();

      // Create an empty composer.json file
      const packageName = `${phpApplication.id}-${phpApplication.metadata.version}`;
      const composerFile = path.join(test.sandbox, packageName, 'composer.json');
      nfile.touch(composerFile);

      phpApplication.install();
      expect(log.text).to.contain('composer install');
    });
    it('allows defining custom composer parameters', () => {
      class CustomComposerApplication extends PHPApplication {
        get composerInstallParameters() {
          return super.composerInstallParameters.concat(['--no-dev']);
        }
      }

      const phpApplication = createTestRecipe(CustomComposerApplication);
      phpApplication.setup({be});
      phpApplication.cleanup();

      // Create an empty composer.json file
      const packageName = `${phpApplication.id}-${phpApplication.metadata.version}`;
      const composerFile = path.join(test.sandbox, packageName, 'composer.json');
      nfile.touch(composerFile);

      phpApplication.install();
      expect(log.text).to.contain('composer install --no-dev');
    });
  });

  context('when composer.json not present', () => {
    it('does not build', () => {
      const phpApplication = createTestRecipe(PHPApplication);
      phpApplication.setup({be});
      phpApplication.cleanup();
      phpApplication.install();
      expect(log.text).to.not.contain('composer install');
    });
  });

  it('should return its buildDependencies', () => {
    const phpApplication = createTestRecipe(PHPApplication);
    const phpRuntimeDependencies = [
      'php', 'libc6', 'zlib1g', 'libxslt1.1', 'libtidy-0.99-0', 'libreadline6', 'libncurses5', 'libtinfo5',
      'libmcrypt4', 'libldap-2.4-2', 'libstdc++6', 'libgmp10', 'libpng12-0', 'libjpeg62-turbo', 'libbz2-1.0', 'libxml2',
      'libssl1.0.0', 'libcurl3', 'libfreetype6', 'libicu52', 'libgcc1', 'libgcrypt20', 'libsasl2-2',
      'libgnutls-deb0-28', 'liblzma5', 'libidn11', 'librtmp1', 'libssh2-1', 'libgssapi-krb5-2', 'libkrb5-3',
      'libk5crypto3', 'libcomerr2', 'libgpg-error0', 'libp11-kit0', 'libtasn1-6', 'libnettle4', 'libhogweed2',
      'libkrb5support0', 'libkeyutils1', 'libffi6', 'libsybdb5', 'libpq5'
    ];
    expect(_.map(phpApplication.buildDependencies, bd => bd.id)).to.be.eql(phpRuntimeDependencies);
  });

  it('installs files to the target directory', () => {
    const phpApplication = createTestRecipe(PHPApplication);
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
