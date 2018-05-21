'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 9.X
 * @namespace BaseComponents.Node9Application
 * @class
 * @extends NodeApplication
 */
class Node9Application extends NodeApplication {
  nodeVersion() { return '9.11.1-0'; }
}

module.exports = Node9Application;
