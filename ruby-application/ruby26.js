'use strict';

const RubyApplication = require('./index');

/**
 * Class representing a ruby Application for versions 2.6.X
 * @namespace BaseComponents.Ruby26Application
 * @class
 * @extends rubyApplication
 */
class Ruby26Application extends RubyApplication {
  rubyVersion() { return '2.6.1-0'; }
}

module.exports = Ruby26Application;
