'use strict';

const nfile = require('nami-utils').file;
const path = require('path');
const _ = require('nami-utils/lodash-extra');
const tarballUtils = require('tarball-utils');
const CompiledComponent = require('blacksmith/lib/base-components').CompiledComponent;

class DokuwikiPlugin extends CompiledComponent {
  /**
  * Folder name for the plugin at the plugins dir
  */
  get pluginName() {
    return 'defaultFolder';
  }

  /**
   * Get build prefix
  */
  get prefix() {
    return nfile.join(this.be.prefixDir, 'dokuwiki', 'lib', 'plugins');
  }

  /**
  * Extract component tarball in srcDir
  */
  extract() {
    const pluginDir = nfile.join(this.prefix, this.pluginName);
    nfile.mkdir(pluginDir);

    if (_.isEmpty(this.source.tarball)) {
      throw new Error(`The source tarball is missing. Received ${this.source.tarball}`);
    }
    if (!path.isAbsolute(this.source.tarball)) {
      throw new Error(`Path to source tarball should be absolute. Found ${this.source.tarball}`);
    }
    this._validateChecksum(this.source.tarball, this.source.sha256);

    tarballUtils.unpack(this.source.tarball, this.srcDir);
    nfile.move(nfile.join(this.be.srcDir, '*/*'), pluginDir);
  }
}

module.exports = DokuwikiPlugin;
