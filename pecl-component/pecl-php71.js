'use strict';

const peclComponent = require('./index');
const PHP71Application = require('../php-application/php71.js');

class peclPHP71Component extends peclComponent {
  get buildDependencies() {
    return PHP71Application.prototype.buildDependencies;
  }
}

module.exports = peclPHP71Component;
