'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 6.X
 * @namespace BaseComponents.Node6Application
 * @class
 * @extends NodeApplication
 */
class Node6Application extends NodeApplication {
  nodeVersion() { return '6.14.3-0'; }
}

module.exports = Node6Application;
