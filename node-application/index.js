'use strict';

const nfile = require('nami-utils').file;
const _ = require('nami-utils/lodash-extra');
const CompilableComponent = require('blacksmith/lib/base-components').CompilableComponent;

/**
 * Class representing a Node Application
 * @namespace BaseComponents.NodeApplication
 * @class
 * @extends CompilableComponent
 */
class NodeApplication extends CompilableComponent {
  get buildDependencies() {
    const debianPackages = [
      'imagemagick',
      'ghostscript',
      'libc6',
      'libmysqlclient18',
    ];
    return [{
      'type': 'nami',
      'id': 'node',
      'installCommands': [`bitnami-pkg install node-${this.nodeVersion()}`],
      'envVars': {
        PATH: '$PATH:/opt/bitnami/node/bin:/opt/bitnami/python/bin'
      }
    }].concat(_.map(debianPackages, pkg => {
      return {'type': 'system', 'id': pkg, distro: 'debian'};
    }));
  }

  /**
   * Node version to build
   * @function NodeApplication~nodeVersion
   * @returns {String} Node version to build.
   */
  nodeVersion() {
    return '7.10.1-1';
  }

  /**
   * Create prefix and copy source files
   * @function NodeApplication~build
   */
  build() {
    nfile.mkdir(this.prefix);
    nfile.copy(nfile.join(this.srcDir, '*'), this.prefix);
  }

  /**
   * Additional modules to install not present in the package.json.
   * @function BaseComponents.NodeApplication~additionalModules
   * @returns {Array} Node modules to add. Empty by default.
   */
  additionalModules() {
    return [];
  }
  /**
   * Install the node application. Download and install node modules
   * @function BaseComponents.NodeApplication~install
   * @param {Object} [options]
   * @param {Array} [options.extraArgs=['-no-optional']] - Extra arguments for the npm install command.
   */
  install(options) {
    options = _.defaults(options || {}, {extraArgs: ['-no-optional']});
    const _additionalModules = this.additionalModules();
    const args = ['install', '--production'].concat(options.extraArgs);
    this.sandbox.runProgram(nfile.join(this.be.prefixDir, 'node/bin/npm'),
                            args, {cwd: this.prefix});
    if (!_.isEmpty(_additionalModules)) {
      this.sandbox.runProgram(nfile.join(this.be.prefixDir, 'node/bin/npm'),
                              _.flatten(['install', _additionalModules, '--save']), {cwd: this.prefix});
    }
  }
}

module.exports = NodeApplication;
