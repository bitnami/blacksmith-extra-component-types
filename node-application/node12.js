'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 12.X
 * @namespace BaseComponents.Node10Application
 * @class
 * @extends NodeApplication
 */
class Node12Application extends NodeApplication {
  nodeVersion() { return '12.18.3-0'; }
}

module.exports = Node12Application;
