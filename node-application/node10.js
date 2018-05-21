'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 10.X
 * @namespace BaseComponents.Node10Application
 * @class
 * @extends NodeApplication
 */
class Node10Application extends NodeApplication {
  nodeVersion() { return '10.1.0-0'; }
}

module.exports = Node10Application;
