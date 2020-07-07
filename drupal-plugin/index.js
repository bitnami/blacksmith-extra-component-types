'use strict';

const nfile = require('nami-utils').file;
const path = require('path');
const _ = require('nami-utils/lodash-extra');
const tarballUtils = require('tarball-utils');
const CompiledComponent = require('blacksmith/lib/base-components').CompiledComponent;

class DrupalPlugin extends CompiledComponent {
  /**
   * Get build prefix
   */
  get prefix() {
    return nfile.join(this.be.prefixDir, 'drupal');
  }

  /**
   * Extract component tarball in srcDir
   */
  extract() {
    if (_.isEmpty(this.source.tarball)) {
      throw new Error(`The source tarball is missing. Received ${this.source.tarball}`);
    }
    if (!path.isAbsolute(this.source.tarball)) {
      throw new Error(`Path to source tarball should be absolute. Found ${this.source.tarball}`);
    }
    this._validateChecksum(this.source.tarball, this.source.sha256);
    tarballUtils.unpack(this.source.tarball, this.srcDir, {reRoot: true});
  }

  /**
   * Copy the plugin directory to the final destination
   */
  install() {
    const pluginName = this.metadata.id.replace('drupal-plugin-', '');
    const pluginDir = nfile.join(this.prefix, 'modules', 'contrib', pluginName);
    nfile.copy(this.srcDir, pluginDir);
  }
}

module.exports = DrupalPlugin;
