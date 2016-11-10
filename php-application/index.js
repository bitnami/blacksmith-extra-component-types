'use strict';

const nfile = require('nami-utils').file;
const nos = require('nami-utils').os;
const CompiledComponent = require('blacksmith-base-components').CompiledComponent;

/**
 * Class representing a PHP Application
 * @namespace BaseComponents.PHPApplication
 * @class
 * @extends CompiledComponent
 */
class PHPApplication extends CompiledComponent {
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
