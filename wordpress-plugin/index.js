'use strict';

const nfile = require('nami-utils').file;
const CompiledComponent = require('blacksmith/lib/base-components').CompiledComponent;

class WordPressPlugin extends CompiledComponent {
  /**
   * Get build prefix
   * @returns {mixed}
  */
  get prefix() {
    return nfile.join(this.be.prefixDir, 'wordpress', 'wp-content', 'plugins');
  }
}

module.exports = WordPressPlugin;
