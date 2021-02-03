'use strict';

const JavaApplication = require('./index');

class Java15Application extends JavaApplication {
  javaVersion() { return '15.0.2-0'; }
}

module.exports = Java15Application;
