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
      'installCommands': [`bitnami-pkg install php-${this.phpVersion}`],
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
        'libgpg-error0',
        'libgssapi-krb5-2',
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
        'libp11-kit0',
        'libpq5',
        'libreadline-dev',
        'librtmp1',
        'libsasl2-2',
        'libssh2-1',
        'libstdc++6',
        'libsybdb5',
        'libtasn1-6',
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
        'libpng',
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
    const debianSpecialDeps = [
      {
        type: 'system',
        id: 'libgnutls-deb0-28',
        distro: 'debian',
        version: '8',
      },
      {
        type: 'system',
        id: 'libgnutls28-dev',
        distro: 'debian',
        version: '9',
      },
      {
        type: 'system',
        id: 'libhogweed2',
        distro: 'debian',
        version: '8',
      },
      {
        type: 'system',
        id: 'libhogweed4',
        distro: 'debian',
        version: '9',
      },
      {
        type: 'system',
        id: 'libicu52',
        distro: 'debian',
        version: '8',
      },
      {
        type: 'system',
        id: 'libicu57',
        distro: 'debian',
        version: '9',
      },
      {
        type: 'system',
        id: 'libnettle4',
        distro: 'debian',
        version: '8',
      },
      {
        type: 'system',
        id: 'nettle-dev',
        distro: 'debian',
        version: '9',
      },
      {
        type: 'system',
        id: 'libssl1.0.0',
        distro: 'debian',
        version: '8',
      },
      {
        type: 'system',
        id: 'libssl1.0-dev',
        distro: 'debian',
        version: '9',
      },
      {
        type: 'system',
        id: 'libtidy-0.99-0',
        distro: 'debian',
        version: '8',
      },
      {
        type: 'system',
        id: 'libtidy-dev',
        distro: 'debian',
        version: '9',
      },
      {
        type: 'system',
        id: 'libpng12-0',
        distro: 'debian',
        version: '8',
      },
      {
        type: 'system',
        id: 'libpng-dev',
        distro: 'debian',
        version: '9',
      },
    ];
    systemPackages.rhel = systemPackages.centos;
    systemPackages.ol = systemPackages.centos.concat([
      'libmcrypt-devel',
      'freetds-devel',
      'libtidy-devel',
    ]);

    const packages = _.map(systemPackages, (pkgList, distro) => {
      return _.map(pkgList, (pkg) => {
        return {id: pkg, distro, type: 'system'};
      });
    });

    return _.flatten(packages.concat(modules)).concat(debianSpecialDeps);
  }

  /**
   * PHP version to build
   * @function PHPApplication~phpVersion
   * @returns {String} PHP version to build.
   */
  get phpVersion() {
    return '7.3.0-0';
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
