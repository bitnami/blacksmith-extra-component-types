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
  get buildDependencies() {
    const nodeApplicationBD = super.buildDependencies;
    const node = _.find(nodeApplicationBD, {id: 'node'});
    node.installCommands = ['bitnami-pkg install node-4.8.2-0'];
    return nodeApplicationBD;
  }
}

module.exports = Node4Application;
