'use strict';

const nfile = require('nami-utils').file;
const MakeComponent = require('blacksmith/lib/base-components').MakeComponent;
const PHPApplication = require('../php-application/php71.js');

class peclComponent extends MakeComponent {
  get buildDependencies() {
    return PHPApplication.prototype.buildDependencies;
  }
  get prefix() {
    return nfile.join(this.be.prefixDir, 'php');
  }
  configureOptions() {
    return [`--with-php-config=${this.prefix}/bin/php-config`];
  }
  build() {
    this.sandbox.runProgram(nfile.join(this.prefix, 'bin/phpize'), {cwd: this.workingDir});
    this.configure();
  }
  postInstall() {
    nfile.copy(nfile.join(this.prefix, 'lib/php/extensions/no-debug-non-zts-*/*'),
               nfile.join(this.prefix, 'lib/php/extensions/'));
    nfile.delete(nfile.join(this.prefix, 'lib/php/extensions/no-debug-non-zts-*'));
  }
}

module.exports = peclComponent;
