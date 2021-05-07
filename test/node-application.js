'use strict';

const _ = require('lodash');
const NodeApplication = require('../node-application');
const Node10Application = require('../node-application');
const Node12Application = require('../node-application/node12');
const Node14Application = require('../node-application/node14');
const Node15Application = require('../node-application/node15');
const Node16Application = require('../node-application/node16');
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
  it('should return its buildDependencies', () => {
    const nodeApplication = new NodeApplication();
    expect(_.map(_.filter(nodeApplication.buildDependencies,
      bd => !bd.version || bd.version === '9'), bd => bd.id)).to.be.eql([
        'node', 'default-libmysqlclient-dev', 'imagemagick', 'ghostscript', 'libc6',
      ]
    );
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

describe('Node10 Application', function() {
  it('should return its buildDependencies', () => {
    const nodeApplication = new Node10Application();
    const nodeBuildDep = _.find(nodeApplication.buildDependencies, bd => bd.id === 'node');
    expect(nodeBuildDep.installCommands[0]).to.match(/bitnami-pkg install node-10\..*/);
  });
});

describe('Node12 Application', function() {
  it('should return its buildDependencies', () => {
    const nodeApplication = new Node12Application();
    const nodeBuildDep = _.find(nodeApplication.buildDependencies, bd => bd.id === 'node');
    expect(nodeBuildDep.installCommands[0]).to.match(/bitnami-pkg install node-12\..*/);
  });
});

describe('Node14 Application', function() {
  it('should return its buildDependencies', () => {
    const nodeApplication = new Node14Application();
    const nodeBuildDep = _.find(nodeApplication.buildDependencies, bd => bd.id === 'node');
    expect(nodeBuildDep.installCommands[0]).to.match(/bitnami-pkg install node-14\..*/);
  });
});

describe('Node15 Application', function() {
  it('should return its buildDependencies', () => {
    const nodeApplication = new Node15Application();
    const nodeBuildDep = _.find(nodeApplication.buildDependencies, bd => bd.id === 'node');
    expect(nodeBuildDep.installCommands[0]).to.match(/bitnami-pkg install node-15\..*/);
  });
});

describe('Node16 Application', function() {
  it('should return its buildDependencies', () => {
    const nodeApplication = new Node16Application();
    const nodeBuildDep = _.find(nodeApplication.buildDependencies, bd => bd.id === 'node');
    expect(nodeBuildDep.installCommands[0]).to.match(/bitnami-pkg install node-16\..*/);
  });
});
