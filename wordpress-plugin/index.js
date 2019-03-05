'use strict';

const nfile = require('nami-utils').file;
const path = require('path');
const _ = require('nami-utils/lodash-extra');
const tarballUtils = require('tarball-utils');
const CompiledComponent = require('blacksmith/lib/base-components').CompiledComponent;

class WordPressPlugin extends CompiledComponent {
  /**
   * Get build prefix
  */
  get prefix() {
    return nfile.join(this.be.prefixDir, 'wordpress', 'wp-content', 'plugins');
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
    tarballUtils.unpack(this.source.tarball, this.srcDir);
  }
  /**
   * Each plugin includes its own license in the source tarball
   */
  fulfillLicenseRequirements() {}
}

module.exports = WordPressPlugin;
