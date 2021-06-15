'use strict';

const PHPApplication = require('./index');

/**
 * Class representing a PHP Application for versions 7.4.X
 * @namespace BaseComponents.PHP72Application
 * @class
 * @extends PHPApplication
 */
class PHP74Application extends PHPApplication {
  get phpVersion() {
    return '7.4.20-1';
  }
}

module.exports = PHP74Application;
