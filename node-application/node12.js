'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 12.X
 * @namespace BaseComponents.Node12Application
 * @class
 * @extends NodeApplication
 */
class Node12Application extends NodeApplication {
  nodeVersion() { return '12.22.1-0'; }
}

module.exports = Node12Application;
