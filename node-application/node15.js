'use strict';

const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 15.X
 * @namespace BaseComponents.Node15Application
 * @class
 * @extends NodeApplication
 */
class Node15Application extends NodeApplication {
  nodeVersion() { return '15.14.0-0'; }
}

module.exports = Node15Application;
