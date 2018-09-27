'use strict';

const PHPApplication = require('./index');

/**
 * Class representing a PHP Application for versions 7.2.X
 * @namespace BaseComponents.PHP72Application
 * @class
 * @extends PHPApplication
 */
class PHP72Application extends PHPApplication {
  get phpVersion() {
    return '7.2.10-0';
  }
}

module.exports = PHP72Application;
