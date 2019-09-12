'use strict';

const peclComponent = require('./index');
const PHP72Application = require('../php-application/php72.js');

class peclPHP72Component extends peclComponent {
  get buildDependencies() {
    return PHP72Application.prototype.buildDependencies;
  }
}

module.exports = peclPHP72Component;
