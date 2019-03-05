'use strict';

const nfile = require('nami-utils').file;
const CompiledComponent = require('blacksmith/lib/base-components').CompiledComponent;

class WordPressPlugin extends CompiledComponent {
  /**
   * Get build prefix
   * @returns {mixed}
  */
  get prefix() {
    const pluginDirname = this.id.replace(/wordpress-plugin-/g,'');
    return nfile.join(this.be.prefixDir, 'wordpress', 'wp-content', 'plugins', pluginDirname);
  }
}

module.exports = WordPressPlugin;
