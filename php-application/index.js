'use strict';

const nfile = require('nami-utils').file;
const CompilableComponent = require('blacksmith-base-components').CompilableComponent;

/**
 * Class representing a Node Application
 * @namespace BaseComponents.NodeApplication
 * @class
 * @extends CompilableComponent
 */
class PHPApplication extends CompilableComponent {
    build() {
        console.log(this.prefix);
    }

    install(options) {
    }
}

module.exports = PHPApplication;
