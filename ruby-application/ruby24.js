'use strict';

const RubyApplication = require('./index');

/**
 * Class representing a ruby Application for versions 2.4.X
 * @namespace BaseComponents.Ruby24Application
 * @class
 * @extends rubyApplication
 */
class Ruby24Application extends RubyApplication {
  rubyVersion() { return '2.4.4-0'; }
}

module.exports = Ruby24Application;
