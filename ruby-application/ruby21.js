'use strict';

const _ = require('nami-utils/lodash-extra');
const RubyApplication = require('./index');

/**
 * Class representing a ruby Application for versions 2.1.X
 * @namespace BaseComponents.Ruby21Application
 * @class
 * @extends rubyApplication
 */
class Ruby21Application extends RubyApplication {
  get buildDependencies() {
    const rubyApplicationBD = super.buildDependencies;
    const ruby = _.find(rubyApplicationBD, {id: 'ruby'});
    ruby.installCommands = ['bitnami-pkg install ruby-2.1.10-4'];
    return rubyApplicationBD;
  }
}

module.exports = Ruby21Application;
