'use strict';

const HarborComponent = require('../harbor-component');

const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('Harbor Component', function() {
  let be;
  let test;

  function createHarborComponent() {
    const component = helpers.createComponent(test);
    const harborComponent = new HarborComponent({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    });
    harborComponent.setup({be});
    return harborComponent;
  }

  beforeEach('prepare environment', () => {
    helpers.cleanTestEnv();
    test = helpers.createTestEnv();
    be = helpers.getDummyBuildEnvironment(test);
  });

  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });

  it('Should parse the version of an existing component', () => {
    const harborComponent = createHarborComponent();
    const componentToParse = 'docker-distribution';
    const componentRegex = /REGISTRYVERSION=v(\d+[.]\d+[.]\d+(-\d+)?)/;
    const exampleVersion = harborComponent._getVersionFromHarbor(componentToParse, componentRegex);
    expect(exampleVersion).to.match(/\d+[.]\d+[.]\d+/);
  });

  it('Should fail when checking the version of a non existing component', () => {
    const harborComponent = createHarborComponent();
    const harborMakefileURL = 'https://raw.githubusercontent.com/goharbor/harbor/master/Makefile';
    const componentToParse = 'notExisting';
    const componentRegex = /THISWILLFAIL=v(\d+[.]\d+[.]\d+(-\d+)?)/;
    const exception = new Error(`Could not parse ${componentToParse} version from ${harborMakefileURL}`);
    const failFunc = harborComponent._getVersionFromHarbor.bind(componentRegex, componentToParse);
    expect(failFunc).to.throw(exception);
  });
});
