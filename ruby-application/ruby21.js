'use strict';

const RubyApplication = require('./index');

/**
 * Class representing a ruby Application for versions 2.1.X
 * @namespace BaseComponents.Ruby21Application
 * @class
 * @extends rubyApplication
 */
class Ruby21Application extends RubyApplication {
  rubyVersion() { return '2.1.10-5'; }
}

module.exports = Ruby21Application;
