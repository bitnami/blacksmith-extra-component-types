'use strict';

const JavaApplication = require('./index');

class Java8Application extends JavaApplication {
  javaVersion() { return '1.8.282-0'; }
}

module.exports = Java8Application;
