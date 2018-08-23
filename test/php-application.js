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
    const phpRuntimeDependencies = {
      'debian-8': [
        'libbz2-1.0', 'libc6', 'libcomerr2', 'libcurl3', 'libffi6', 'libfreetype6', 'libgcc1', 'libgcrypt20',
        'libgmp10', 'libgpg-error0', 'libgssapi-krb5-2',
        'libidn11', 'libjpeg62-turbo', 'libk5crypto3', 'libkeyutils1', 'libkrb5-3', 'libkrb5support0',
        'libldap-2.4-2', 'liblzma5', 'libmcrypt4', 'libncurses5', 'libp11-kit0',
        'libpq5', 'libreadline-dev', 'librtmp1', 'libsasl2-2', 'libssh2-1', 'libstdc++6',
        'libsybdb5', 'libtasn1-6', 'libtinfo5', 'libxml2', 'libxslt1.1', 'zlib1g', 'libgnutls-deb0-28', 'libhogweed2',
        'libicu52', 'libnettle4', 'libssl1.0.0', 'libtidy-0.99-0', 'libpng12-0'
      ],
      'debian-9': [
        'libbz2-1.0', 'libc6', 'libcomerr2', 'libcurl3', 'libffi6', 'libfreetype6', 'libgcc1', 'libgcrypt20',
        'libgmp10', 'libgpg-error0', 'libgssapi-krb5-2',
        'libidn11', 'libjpeg62-turbo', 'libk5crypto3', 'libkeyutils1', 'libkrb5-3', 'libkrb5support0',
        'libldap-2.4-2', 'liblzma5', 'libmcrypt4', 'libncurses5', 'libp11-kit0',
        'libpq5', 'libreadline-dev', 'librtmp1', 'libsasl2-2', 'libssh2-1', 'libstdc++6',
        'libsybdb5', 'libtasn1-6', 'libtinfo5', 'libxml2', 'libxslt1.1', 'zlib1g',
        'libgnutls28-dev', 'libhogweed4', 'libicu57', 'nettle-dev', 'libssl1.0-dev', 'libtidy-dev', 'libpng-dev'
      ],
      centos: [
        'bzip2-libs', 'cyrus-sasl-lib', 'freetype', 'glibc', 'gmp', 'keyutils-libs', 'krb5-libs', 'libcom_err',
        'libcurl', 'libgcc', 'libgcrypt', 'libgpg-error', 'libicu', 'libidn', 'libjpeg-turbo', 'libpng',
        'libselinux', 'libssh2', 'libstdc++', 'libxml2', 'libxslt', 'ncurses-libs', 'nspr', 'nss', 'nss-softokn-freebl',
        'nss-util', 'openldap', 'openssl-libs', 'pcre', 'postgresql-libs', 'readline', 'xz-libs', 'zlib',
      ],
    };
    phpRuntimeDependencies.rhel = phpRuntimeDependencies.centos;
    phpRuntimeDependencies.ol = phpRuntimeDependencies.centos.concat([
      'libmcrypt-devel',
      'freetds-devel',
      'fgci-devel',
      'libtidy-devel',
      'libpqxx-dev',
    ]);

    const getBuildDependencies = (deps, distro, version) => _.map(_.filter(deps, bd => bd.distro === distro &&
      (!version || !bd.version || version === bd.version)), bd => bd.id);

    const phpBuildDependencies = {
      'debian-8': getBuildDependencies(phpApplication.buildDependencies, 'debian', '8'),
      'debian-9': getBuildDependencies(phpApplication.buildDependencies, 'debian', '9'),
      centos: getBuildDependencies(phpApplication.buildDependencies, 'centos'),
      rhel: getBuildDependencies(phpApplication.buildDependencies, 'rhel'),
      ol: getBuildDependencies(phpApplication.buildDependencies, 'ol'),
    };

    expect(phpBuildDependencies).to.be.eql(phpRuntimeDependencies);
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
