'use strict';

const nfile = require('nami-utils').file;
const CompiledComponent = require('blacksmith/lib/base-components').CompiledComponent;

class NginxModule extends CompiledComponent {
  get prefix() {
    return nfile.join(this.be.prefixDir, 'nginx');
  }

  set isDynamicModule(value) {
    this._isDynamicModule = value;
  }

  get isDynamicModule() {
    return this._isDynamicModule;
  }

  initialize() {
    this._isDynamicModule = false;
  }

  install() {
    // We want to copy licenses to the NGINX destination, but not the module itself.
  }

  nginxAdditionalConfigureFlags() {
    if (this.isDynamicModule) {
      return [`--add-dynamic-module=${this.srcDir}`];
    }
    return [`--add-module=${this.srcDir}`];
  }
}

module.exports = NginxModule;
