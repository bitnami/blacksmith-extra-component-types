'use strict';

const _ = require('nami-utils/lodash-extra');
const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 4.X
 * @namespace BaseComponents.Node4Application
 * @class
 * @extends NodeApplication
 */
class Node4Application extends NodeApplication {
  nodeVersion() => { return '4.8.2-0'; }
}

Module.exports = Node4Application;
