'use strict';

const _ = require('lodash');
const JavaApplication = require('../java-application');
const Java8Application = require('../java-application/java8');
const Java15Application = require('../java-application/java15');
const path = require('path');
const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('Java Application', function() {
  this.timeout(5000);
  before('prepare environment', () => {
    helpers.cleanTestEnv();
  });
  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });
  it('should return its buildDependencies', () => {
    const javaApplication = new JavaApplication();
    expect(_.map(_.filter(javaApplication.buildDependencies,
      bd => !bd.version || bd.version === '9'), bd => bd.id)).to.be.eql(
      [
        'java', 'maven', 'ant'
      ]
    );
  });
  it('builds a sample java application', () => {
    const log = {};
    const test = helpers.createTestEnv();
    const component = helpers.createComponent(test);
    helpers.createDummyExecutable(path.join(test.prefix, 'java/bin/java'));
    const javaApplication = new JavaApplication({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    }, {logger: helpers.getDummyLogger(log)});
    javaApplication.id = component.id;
    javaApplication.sourceTarball = component.sourceTarball;
    javaApplication.additionalModules = () => ['test'];

    // Build process
    const be = helpers.getDummyBuildEnvironment(test);
    javaApplication.setup({be});
    javaApplication.cleanup();
    javaApplication.extract();
    javaApplication.copyExtraFiles();
    javaApplication.patch();
    javaApplication.postExtract();
    javaApplication.build();
    javaApplication.postBuild();
    javaApplication.install();
    javaApplication.install({extraArgs: ['--test']});
    javaApplication.fulfillLicenseRequirements();
    javaApplication.postInstall();
  });
});

describe('Java11 Application', function() {
  it('should return its buildDependencies', () => {
    const javaApplication = new JavaApplication();
    const javaBuildDep = _.find(javaApplication.buildDependencies, bd => bd.id === 'java');
    expect(javaBuildDep.installCommands[0]).to.match(/bitnami-pkg install java-11\..*/);
  });
});

describe('Java8 Application', function() {
  it('should return its buildDependencies', () => {
    const javaApplication = new Java8Application();
    const javaBuildDep = _.find(javaApplication.buildDependencies, bd => bd.id === 'java');
    expect(javaBuildDep.installCommands[0]).to.match(/bitnami-pkg install java-1.8\..*/);
  });
});

describe('Java15 Application', function() {
  it('should return its buildDependencies', () => {
    const javaApplication = new Java15Application();
    const javaBuildDep = _.find(javaApplication.buildDependencies, bd => bd.id === 'java');
    expect(javaBuildDep.installCommands[0]).to.match(/bitnami-pkg install java-15\..*/);
  });
});
