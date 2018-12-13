'use strict';

const PHPApplication = require('./index');

/**
 * Class representing a PHP Application for versions 7.3.X
 * @namespace BaseComponents.PHP73Application
 * @class
 * @extends PHPApplication
 */
class PHP72Application extends PHPApplication {
  get phpVersion() {
    return '7.3.0-0';
  }
}

module.exports = PHP73Application;
