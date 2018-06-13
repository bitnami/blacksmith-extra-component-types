'use strict';

const RubyApplication = require('./index');

/**
 * Class representing a ruby Application for versions 2.5.X
 * @namespace BaseComponents.Ruby25Application
 * @class
 * @extends rubyApplication
 */
class Ruby25Application extends RubyApplication {
  rubyVersion() { return '2.5.1-0'; }
}

module.exports = Ruby25Application;
