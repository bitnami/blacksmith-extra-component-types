'use strict';

const RubyApplication = require('./index');
const nfile = require('nami-utils').file;

/**
 * Class representing a ruby Application for versions 2.5.X
 * @namespace BaseComponents.Ruby25Application
 * @class
 * @extends rubyApplication
 */
class Ruby25Application extends RubyApplication {
  rubyVersion() { return '2.5.8-0'; }
  install(options) {
    // Install latest Bundler 1.x gem, which is still used by some Ruby 2.5 applications
    this.sandbox.runProgram(nfile.join(this.be.prefixDir, 'ruby/bin/gem'), ['install', 'bundler', '-v', '< 2']);
    super.install(options);
  }
}

module.exports = Ruby25Application;
