'use strict';

const RubyApplication = require('./index');

/**
 * Class representing a ruby Application for versions 2.7.X
 * @namespace BaseComponents.Ruby21Application
 * @class
 * @extends rubyApplication
 */
class Ruby21Application extends RubyApplication {
  rubyVersion() { return '2.7.1-0'; }
}

module.exports = Ruby27Application;
