'use strict';

const _ = require('lodash');
const nfile = require('nami-utils').file;
const nos = require('nami-utils').os;
const CompiledComponent = require('blacksmith/lib/base-components').CompiledComponent;

/**
 * Class representing a PHP Application
 * @namespace BaseComponents.PHPApplication
 * @class
 * @extends CompiledComponent
 */
class PHPApplication extends CompiledComponent {
  get buildDependencies() {
    const modules = [{
      'type': 'nami',
      'id': 'php',
      'installCommands': ['bitnami-pkg install php-7.0.30-5'],
      'envVars': {
        PATH: '$PATH:/opt/bitnami/php/bin'
      }
    }];

    const systemPackages = {
      debian: [
        'libbz2-1.0',
        'libc6',
        'libcomerr2',
        'libcurl3',
        'libffi6',
        'libfreetype6',
        'libgcc1',
        'libgcrypt20',
        'libgmp10',
        'libgnutls28-dev',
        'libgpg-error0',
        'libgssapi-krb5-2',
        'libhogweed4',
        'libicu57',
        'libidn11',
        'libjpeg62-turbo',
        'libk5crypto3',
        'libkeyutils1',
        'libkrb5-3',
        'libkrb5support0',
        'libldap-2.4-2',
        'liblzma5',
        'libmcrypt4',
        'libncurses5',
        'nettle-dev',
        'libp11-kit0',
        'libpng12-0',
        'libpq5',
        'libreadline-dev',
        'librtmp1',
        'libsasl2-2',
        'libssh2-1',
        'libssl1.0-dev',
        'libstdc++6',
        'libsybdb5',
        'libtasn1-6',
        'libtidy-dev',
        'libtinfo5',
        'libxml2',
        'libxslt1.1',
        'zlib1g',
      ],
      centos: [
        'bzip2-libs',
        'cyrus-sasl-lib',
        'freetype',
        'glibc',
        'gmp',
        'keyutils-libs',
        'krb5-libs',
        'libcom_err',
        'libcurl',
        'libgcc',
        'libgcrypt',
        'libgpg-error',
        'libicu',
        'libidn',
        'libjpeg-turbo',
        'libpng-dev',
        'libselinux',
        'libssh2',
        'libstdc++',
        'libxml2',
        'libxslt',
        'ncurses-libs',
        'nspr',
        'nss',
        'nss-softokn-freebl',
        'nss-util',
        'openldap',
        'openssl-libs',
        'pcre',
        'postgresql-libs',
        'readline',
        'xz-libs',
        'zlib',
      ],
    };
    systemPackages.rhel = systemPackages.centos;
    systemPackages.ol = systemPackages.centos.concat([
      'libmcrypt-devel',
      'freetds-devel',
      'fgci-devel',
      'libtidy-devel',
      'libpqxx-dev',
    ]);

    const packages = _.map(systemPackages, (pkgList, distro) => {
      return _.map(pkgList, (pkg) => {
        return {id: pkg, distro, type: 'system'};
      });
    });

    return _.flatten(packages.concat(modules));
  }

  /**
   * When running composer install, append these paramaters to the command line arguments
   * @returns {String[]}
   */
  get composerInstallParameters() {
    return [];
  }

  /**
   * Install the PHP Application. Use composer to download and install
   * dependencies if composer.json exists.
   * @function BaseComponents.PHPAppliction~install
   */
  install() {
    if (nfile.exists(nfile.join(this.workingDir, 'composer.json'))) {
      const composerPath = nfile.join(this.be.prefixDir, 'php/bin/composer');
      const opts = {cwd: this.workingDir, logger: this.logger};
      const phpPath = nfile.join(this.be.prefixDir, 'php/bin/php');
      let cmdArgs = [composerPath, 'install'];
      if (this.composerInstallParameters.length) {
        cmdArgs = cmdArgs.concat(this.composerInstallParameters);
      }
      nos.runProgram(phpPath, cmdArgs, opts);
    }
    super.install();
  }
}

module.exports = PHPApplication;
