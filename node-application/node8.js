'use strict';

const _ = require('nami-utils/lodash-extra');
const NodeApplication = require('./index');

/**
 * Class representing a Node Application for versions 8.X
 * @namespace BaseComponents.Node8Application
 * @class
 * @extends NodeApplication
 */
class Node8Application extends NodeApplication {
  get buildDependencies() {
    const nodeApplicationBD = super.buildDependencies;
    const node = _.find(nodeApplicationBD, {id: 'node'});
    node.installCommands = ['bitnami-pkg install node-8.11.1-0'];
    return nodeApplicationBD;
  }
}

module.exports = Node8Application;
