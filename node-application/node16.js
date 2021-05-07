'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 16.X
 * @namespace BaseComponents.Node16Application
 * @class
 * @extends NodeApplication
 */
class Node16Application extends NodeApplication {
  nodeVersion() { return '16.1.0-0'; }
}

module.exports = Node16Application;
