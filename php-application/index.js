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
        'freetds-dev',
        'libargon2-0-dev',
        'libbz2-1.0',
        'libbz2-dev',
        'libc6',
        'libcomerr2',
        'libcurl4-openssl-dev',
        'libexpat1-dev',
        'libfcgi-dev',
        'libffi6',
        'libfreetype6',
        'libfreetype6-dev',
        'libgcc1',
        'libgcrypt20',
        'libgmp10',
        'libgmp-dev',
        'libgnutls28-dev',
        'libgpg-error0',
        'libgssapi-krb5-2',
        'libhogweed4',
        'libicu-dev',
        'libidn11',
        'libjpeg62-turbo',
        'libjpeg-dev',
        'libk5crypto3',
        'libkeyutils1',
        'libkrb5-3',
        'libkrb5support0',
        'libldap-2.4-2',
        'liblzma5',
        'libmcrypt4',
        'libncurses5',
        'libonig-dev',
        'libp11-kit0',
        'libpng-dev',
        'libpq5',
        'libpq-dev',
        'libreadline-dev',
        'librtmp1',
        'libsasl2-2',
        'libsodium-dev',
        'libsqlite3-dev',
        'libssh2-1',
        'libssl-dev',
        'libstdc++6',
        'libsybdb5',
        'libtasn1-6',
        'libtidy-dev',
        'libtinfo5',
        'libwebp-dev',
        'libxml2',
        'libxslt1.1',
        'libzip-dev',
        'nettle-dev',
        'zlib1g',
      ],
      centos: [
        'bzip2-devel',
        'bzip2-libs',
        'cyrus-sasl-lib',
        'expat-devel',
        // 'fgci-devel', TODO: add EPEL
        // 'freetds-devel', TODO: add EPEL
        'freetype',
        'freetype-devel',
        'glibc',
        'gmp',
        'gmp-devel',
        'keyutils-libs',
        'krb5-libs',
        'libargon2-devel', // Needs EPEL
        'libcom_err',
        'libcurl',
        'libcurl-devel',
        'libgcc',
        'libgcrypt',
        'libgpg-error',
        'libicu',
        'libicu-devel',
        'libidn',
        'libjpeg-turbo',
        'libjpeg-turbo-devel',
        'libpng',
        'libpng-devel',
        // 'libpqxx-dev' TODO: add EPEL
        'libselinux',
        'libsodium-devel',
        'libssh2',
        'libstdc++',
        // 'libtidy-devel', TODO: add EPEL
        'libwebp-devel',
        'libxml2',
        'libxslt',
        'ncurses-libs',
        'nspr',
        'nss',
        'nss-softokn-freebl',
        'nss-util',
        'oniguruma-devel',
        'openldap',
        'openssl',
        'openssl-libs',
        'pcre',
        'postgresql-devel',
        'postgresql-libs',
        'readline',
        'sqlite-devel',
        'xz-libs',
        'zlib',
      ],
    };
    const debianSpecialDeps = [
      {
        type: 'system',
        id: 'libcurl4',
        distro: 'debian',
        version: '10',
      },
      {
        type: 'system',
        id: 'libcurl3',
        distro: 'debian',
        version: '9',
      },
      {
        type: 'system',
        id: 'libicu57',
        distro: 'debian',
        version: '9',
      },
      {
        type: 'system',
        id: 'libicu63',
        distro: 'debian',
        version: '10',
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
    return '7.3.28-1';
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
      const opts = {cwd: this.workingDir, logger: this.logger, env: {COMPOSER_MEMORY_LIMIT: '-1'}};
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
