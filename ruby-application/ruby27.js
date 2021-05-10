'use strict';

const RubyApplication = require('./index');

/**
 * Class representing a Ruby Application for versions 2.7.X
 * @namespace BaseComponents.Ruby27Application
 * @class
 * @extends RubyApplication
 */
class Ruby27Application extends RubyApplication {
  rubyVersion() { return '2.7.3-0'; }
}

module.exports = Ruby27Application;
