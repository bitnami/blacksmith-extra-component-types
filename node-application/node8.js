'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 8.X
 * @namespace BaseComponents.Node8Application
 * @class
 * @extends NodeApplication
 */
class Node8Application extends NodeApplication {
  nodeVersion() { return '8.11.2-0'; }
}

module.exports = Node8Application;
