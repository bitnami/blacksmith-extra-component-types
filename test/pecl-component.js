'use strict';

const PHPApplication = require('../php-application');
const PHP71Application = require('../php-application/php71');
const PeclComponent = require('../pecl-component');
const PeclPHP71Component = require('../pecl-component/pecl-php71');
const path = require('path');
const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('Pecl Component', function() {
  this.timeout(5000);
  before('prepare environment', () => {
    helpers.cleanTestEnv();
  });
  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });
  it('should return its buildDependencies', () => {
    const peclComponent = new PeclComponent();
    expect(peclComponent.buildDependencies).to.be.eql(PHPApplication.prototype.buildDependencies);
  });
  it('should return its buildDependencies', () => {
    const peclPHP71Component = new PeclPHP71Component();
    expect(peclPHP71Component.buildDependencies).to.be.eql(PHP71Application.prototype.buildDependencies);
  });
  it('builds a sample pecl application', () => {
    const log = {};
    const test = helpers.createTestEnv();
    const component = helpers.createComponent(test);
    helpers.createDummyExecutable(path.join(test.prefix, 'php/bin/phpize'));
    const peclcomponent = new PeclComponent({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    }, {logger: helpers.getDummyLogger(log)});
    peclcomponent.id = component.id;
    peclcomponent.sourceTarball = component.sourceTarball;
    // mock make
    peclcomponent.make = () => true;

    // Build process
    const be = helpers.getDummyBuildEnvironment(test);
    peclcomponent.setup({be});
    peclcomponent.cleanup();
    peclcomponent.extract();
    peclcomponent.copyExtraFiles();
    peclcomponent.patch();
    peclcomponent.postExtract();
    peclcomponent.build();
    peclcomponent.postBuild();
    peclcomponent.install();
    peclcomponent.install({extraArgs: ['--test']});
    peclcomponent.fulfillLicenseRequirements();
    peclcomponent.postInstall();
    peclcomponent.minify();
    expect(log.text).to.
      contain(`configure" "--prefix=${test.prefix}/php" "--with-php-config=${test.prefix}/php/bin/php-config"`);
    expect(log.text).to.contain('phpize');
  });
});
