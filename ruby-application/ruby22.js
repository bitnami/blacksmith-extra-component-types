'use strict';

const RubyApplication = require('./index');

/**
 * Class representing a ruby Application for versions 2.2.X
 * @namespace BaseComponents.Ruby22Application
 * @class
 * @extends rubyApplication
 */
class Ruby22Application extends RubyApplication {
  rubyVersion() { return '2.2.10-0'; }
}

module.exports = Ruby22Application;
