'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 12.X
 * @namespace BaseComponents.Node10Application
 * @class
 * @extends NodeApplication
 */
class Node12Application extends NodeApplication {
  nodeVersion() { return '12.16.3-1'; }
}

module.exports = Node12Application;
