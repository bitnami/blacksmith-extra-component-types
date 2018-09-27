'use strict';

const PHPApplication = require('./index');

/**
 * Class representing a PHP Application for versions 7.1.X
 * @namespace BaseComponents.PHP71Application
 * @class
 * @extends PHPApplication
 */
class PHP71Application extends PHPApplication {
  get phpVersion() {
    return '7.1.21-1';
  }
}

module.exports = PHP71Application;
