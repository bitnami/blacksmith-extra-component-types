'use strict';

const JavaApplication = require('./index');

/**
 * Class representing a Java Application for versions 1.8.X
 * @namespace BaseComponents.Java8Application
 * @class
 * @extends JavaApplication
 */
class Java8Application extends JavaApplication {
  javaVersion() { return '1.8.282-0'; }
}

module.exports = Java8Application;
