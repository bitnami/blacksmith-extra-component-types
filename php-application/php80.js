'use strict';

const PHPApplication = require('./index');

/**
 * Class representing a PHP Application for versions 7.2.X
 * @namespace BaseComponents.PHP80Application
 * @class
 * @extends PHPApplication
 */
class PHP80Application extends PHPApplication {
  get phpVersion() {
    return '8.0.7-1';
  }
}

module.exports = PHP80Application;
