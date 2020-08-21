'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 14.X
 * @namespace BaseComponents.Node10Application
 * @class
 * @extends NodeApplication
 */
class Node14Application extends NodeApplication {
  nodeVersion() { return '14.8.0-0'; }
}

module.exports = Node14Application;
