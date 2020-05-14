'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 14.X
 * @namespace BaseComponents.Node10Application
 * @class
 * @extends NodeApplication
 */
class Node14Application extends NodeApplication {
  nodeVersion() { return '14.2.0-1'; }
}

module.exports = Node14Application;
