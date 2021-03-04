'use strict';

const _ = require('lodash');
const PHPApplication = require('../php-application');
const PHP73Application = require('../php-application');
const PHP74Application = require('../php-application/php74');
const PHP80Application = require('../php-application/php80');
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

  function createPHPComponent(RecipeClass) {
    const component = helpers.createComponent(test);
    const phpApplication = new RecipeClass({
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
      const phpApplication = createPHPComponent(PHPApplication);
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

      const phpApplication = createPHPComponent(CustomComposerApplication);
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
      const phpApplication = createPHPComponent(PHPApplication);
      phpApplication.setup({be});
      phpApplication.cleanup();
      phpApplication.install();
      expect(log.text).to.not.contain('composer install');
    });
  });

  it('should return its buildDependencies', () => {
    const phpApplication = createPHPComponent(PHPApplication);

    const getBuildDependencies = (deps, distro, version) => _.map(_.filter(deps, bd => bd.distro === distro &&
      (!version || !bd.version || version === bd.version)), bd => bd.id);

    expect(getBuildDependencies(phpApplication.buildDependencies, 'debian', '10')).to.contain('libbz2-1.0');
    expect(getBuildDependencies(phpApplication.buildDependencies, 'centos', '7')).to.contain('bzip2-libs');
  });

  it('installs files to the target directory', () => {
    const phpApplication = createPHPComponent(PHPApplication);
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

describe('PHP73 Application', function() {
  it('should return its buildDependencies', () => {
    const phpApplication = new PHP73Application();
    const phpBuildDep = _.find(phpApplication.buildDependencies, bd => bd.id === 'php');
    expect(phpBuildDep.installCommands[0]).to.match(/bitnami-pkg install php-7\.3\..*/);
  });
});

describe('PHP74 Application', function() {
  it('should return its buildDependencies', () => {
    const phpApplication = new PHP74Application();
    const phpBuildDep = _.find(phpApplication.buildDependencies, bd => bd.id === 'php');
    expect(phpBuildDep.installCommands[0]).to.match(/bitnami-pkg install php-7\.4\..*/);
  });
});

describe('PHP80 Application', function() {
  it('should return its buildDependencies', () => {
    const phpApplication = new PHP80Application();
    const phpBuildDep = _.find(phpApplication.buildDependencies, bd => bd.id === 'php');
    expect(phpBuildDep.installCommands[0]).to.match(/bitnami-pkg install php-8\.0\..*/);
  });
});
