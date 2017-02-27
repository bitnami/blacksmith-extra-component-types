'use strict';

const NodeApplication = require('../node-application');
const path = require('path');
const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('Node Application', function() {
  this.timeout(5000);
  before('prepare environment', () => {
    helpers.cleanTestEnv();
  });
  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });
  it('builds a sample node application', () => {
    const log = {};
    const test = helpers.createTestEnv();
    const component = helpers.createComponent(test);
    helpers.createDummyExecutable(path.join(test.prefix, 'node/bin/npm'));
    const nodeApplication = new NodeApplication({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    }, {logger: helpers.getDummyLogger(log)});
    nodeApplication.id = component.id;
    nodeApplication.sourceTarball = component.sourceTarball;
    nodeApplication.additionalModules = () => ['test'];

    // Build process
    const be = helpers.getDummyBuildEnvironment(test);
    nodeApplication.setup({be});
    nodeApplication.cleanup();
    nodeApplication.extract();
    nodeApplication.copyExtraFiles();
    nodeApplication.patch();
    nodeApplication.postExtract();
    nodeApplication.build();
    nodeApplication.postBuild();
    nodeApplication.install();
    nodeApplication.install({extraArgs: ['--test']});
    nodeApplication.fulfillLicenseRequirements();
    nodeApplication.postInstall();
    nodeApplication.minify();
    expect(log.text).to.
      contain('npm" "install" "--production" "-no-optional"');
    expect(log.text).to.contain('npm" "install" "--production" "--test"');
    expect(log.text).to.contain('npm" "install" "test" "--save"');
  });
});
