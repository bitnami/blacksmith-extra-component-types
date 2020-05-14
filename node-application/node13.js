'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 13.X
 * @namespace BaseComponents.Node10Application
 * @class
 * @extends NodeApplication
 */
class Node13Application extends NodeApplication {
  nodeVersion() { return '13.14.0-2'; }
}

module.exports = Node13Application;
