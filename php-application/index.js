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
    const debianPackages = [
      'libc6',
      'zlib1g',
      'libxslt1.1',
      'libtidy-0.99-0',
      'libreadline6',
      'libncurses5',
      'libtinfo5',
      'libmcrypt4',
      'libldap-2.4-2',
      'libstdc++6',
      'libgmp10',
      'libpng12-0',
      'libjpeg62-turbo',
      'libbz2-1.0',
      'libxml2',
      'libssl1.0.0',
      'libcurl3',
      'libfreetype6',
      'libicu52',
      'libgcc1',
      'libgcrypt20',
      'libsasl2-2',
      'libgnutls-deb0-28',
      'liblzma5',
      'libidn11',
      'librtmp1',
      'libssh2-1',
      'libgssapi-krb5-2',
      'libkrb5-3',
      'libk5crypto3',
      'libcomerr2',
      'libgpg-error0',
      'libp11-kit0',
      'libtasn1-6',
      'libnettle4',
      'libhogweed2',
      'libkrb5support0',
      'libkeyutils1',
      'libffi6',
      'libsybdb5',
      'libpq5'
    ];
    return [
      {
        'type': 'nami',
        'id': 'php',
        'installCommands': ['bitnami-pkg install php-7.0.17-0'],
        'envVars': {
          PATH: '$PATH:/opt/bitnami/php/bin'
        }
      },
    ].concat(_.map(debianPackages, pkg => {
      return {'type': 'system', 'id': pkg, distro: 'debian'};
    }));
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
      nos.runProgram(nfile.join(this.be.prefixDir, 'php/bin/php'), [composerPath, 'install'], opts);
    }
    super.install();
  }
}

module.exports = PHPApplication;
