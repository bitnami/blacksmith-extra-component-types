'use strict';

const RubyApplication = require('./index');

/**
 * Class representing a Ruby Application for versions 3.0.X
 * @namespace BaseComponents.Ruby30Application
 * @class
 * @extends RubyApplication
 */
class Ruby30Application extends RubyApplication {
  rubyVersion() { return '3.0.1-0'; }
}

module.exports = Ruby30Application;
