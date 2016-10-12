'use strict';

const nfile = require('nami-utils').file;
const CompilableComponent = require('blacksmith-base-components').CompilableComponent;

/**
 * Class representing a Node Application
 * @namespace BaseComponents.NodeApplication
 * @class
 * @extends CompilableComponent
 */
class PHPApplication extends CompilableComponent {
  /**
   * Install the PHP Application. Use composer to download and install
   * dependencies if composer.json exists.
   * @function BaseComponents.PHPAppliction~install
   */
  install() {
    if (nfile.exists(nfile.join(this.workingDir, 'composer.json'))) {
      const composerPath = nfile.join(this.be.prefixDir, 'php/bin/composer');
      this.sandbox.runProgram(nfile.join(this.be.prefixDir, 'php/bin/php'), [composerPath, "install"]);
    }
  }
}

module.exports = PHPApplication;
