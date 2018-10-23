'use strict';

const GoProject = require('../go-project');
const path = require('path');
const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('GoProject', function() {
  this.timeout(5000);
  before('prepare environment', () => {
    helpers.cleanTestEnv();
  });
  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });
  it('should return its buildDependencies', () => {
    const component = new GoProject();
    expect(component.buildDependencies).not.to.be.empty;
    expect(component.buildDependencies.filter(d => d.id === 'go')).not.to.be.empty;
  });
  it('builds a sample go project', () => {
    const log = {};
    const test = helpers.createTestEnv();
    const component = helpers.createComponent(test);
    const goProject = new GoProject({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    }, {logger: helpers.getDummyLogger(log)});
    goProject.id = component.id;
    goProject.sourceTarball = component.sourceTarball;
    Object.defineProperty(goProject, 'goBuildDependencies', {get: () => ['github.com/tools/godep']});
    Object.defineProperty(goProject, 'goImportPrefix', {get: () => 'github.com/test/test'});

    // mock make
    goProject.make = () => true;

    // Build process
    const be = helpers.getDummyBuildEnvironment(test);
    goProject.setup({be});
    goProject.cleanup();
    goProject.extract();
    goProject.copyExtraFiles();
    goProject.patch();
    goProject.postExtract();
    goProject.build();
    goProject.postBuild();
    goProject.install();
    goProject.fulfillLicenseRequirements();
    goProject.postInstall();
  });

  it('throws an error if goImportPrefix is not overriden', () => {
    const component = new GoProject();
    expect(() => component.goImportPrefix()).to.throw();
  });
});
