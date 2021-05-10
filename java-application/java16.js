'use strict';

const JavaApplication = require('./index');

/**
 * Class representing a Java Application for versions 16.X
 * @namespace BaseComponents.Java16Application
 * @class
 * @extends JavaApplication
 */
class Java16Application extends JavaApplication {
  javaVersion() { return '16.0.1-0'; }
}

module.exports = Java16Application;
