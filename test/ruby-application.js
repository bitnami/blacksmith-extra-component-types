'use strict';

const RubyApplication = require('../ruby-application');
const Ruby21Application = require('../ruby-application/ruby21');
const Ruby22Application = require('../ruby-application/ruby22');
const Ruby24Application = require('../ruby-application/ruby24');
const Ruby25Application = require('../ruby-application/ruby25');

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('Ruby Application', function() {
  this.timeout(5000);
  before('prepare environment', () => {
    helpers.cleanTestEnv();
  });
  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });
  it('should return its buildDependencies', () => {
    const rubyApplication = new RubyApplication();
    expect(_.map(_.filter(rubyApplication.buildDependencies, bd => !bd.version || bd.version === '9'),
      bd => bd.id)).to.be.eql([
        'ruby', 'imagemagick', 'ghostscript', 'libc6', 'libmagickwand-dev', 'libpq-dev',
        'libxml2-dev', 'libxslt1-dev', 'libgmp-dev', 'zlib1g-dev', 'default-libmysqlclient-dev',
      ]
    );
  });
  it('builds a sample ruby application', () => {
    const log = {};
    const test = helpers.createTestEnv();
    const component = helpers.createComponent(test);
    helpers.createDummyExecutable(path.join(test.prefix, 'ruby/bin/ruby'));
    helpers.createDummyExecutable(path.join(test.prefix, 'ruby/bin/bundle'));
    const rubyApplication = new RubyApplication({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    }, {logger: helpers.getDummyLogger(log)});
    rubyApplication.id = component.id;
    rubyApplication.sourceTarball = component.sourceTarball;
    // Adds a gem to the Gemfile
    rubyApplication.additionalGems = () => ['test'];

    // Build process
    const be = helpers.getDummyBuildEnvironment(test);
    rubyApplication.setup({be});
    rubyApplication.cleanup();
    rubyApplication.extract();
    fs.writeFileSync(path.join(test.sandbox, `${component.id}-${component.version}/Gemfile`), 'gem "nokogiri"');
    fs.mkdirSync(path.join(test.sandbox, `${component.id}-${component.version}/config`));
    fs.writeFileSync(path.join(test.sandbox, `${component.id}-${component.version}/config/database.yml.example`), '');
    rubyApplication.copyExtraFiles();
    rubyApplication.patch();
    rubyApplication.postExtract();
    rubyApplication.build();
    expect(path.join(path.join(test.prefix, component.id, 'Gemfile'))).to.be.a.file();
    expect(path.join(path.join(test.prefix, component.id, 'config/database.yml.example'))).to.not.be.a.path();
    expect(path.join(path.join(test.prefix, component.id, 'config/database.yml'))).to.be.a.file();
    rubyApplication.postBuild();
    fs.mkdirSync(path.join(test.prefix, component.id, 'log'));
    fs.writeFileSync(
      path.join(test.prefix, component.id, 'log/passenger.3000.log'), // Simulate passenger log
      'Passenger core online'
    );
    rubyApplication.install();
    expect(log.text).to.contain('"install" "--binstubs" "--without" "development" "sqlite" "test" "--no-deployment"');
    expect(log.text).to.contain('"install" "--binstubs" "--without" "development" "sqlite" "test" "--deployment"');
    expect(log.text).to.contain('"exec" "passenger" "start"');
    expect(log.text).to.contain('"exec" "passenger" "stop"');
    const gemfile = fs.readFileSync(path.join(test.prefix, component.id, 'Gemfile'), {encoding: 'utf-8'});
    expect(gemfile).to.contain('passenger');
    expect(gemfile).to.contain('test');
    expect(rubyApplication.getEnvVariables().LDFLAGS).to.contain(`-Wl,-rpath=${test.prefix}/common/lib`);
    rubyApplication.fulfillLicenseRequirements();
    rubyApplication.postInstall();
    rubyApplication.minify();
    expect(path.join(test.prefix, component.id, 'log/passenger.3000.log')).to.not.be.a.path();
  });
});

describe('Ruby21 Application', function() {
  it('should return its buildDependencies', () => {
    const rubyApplication = new Ruby21Application();
    const rubyBuildDep = _.find(rubyApplication.buildDependencies, bd => bd.id === 'ruby');
    expect(rubyBuildDep.installCommands[0]).to.match(/bitnami-pkg install ruby-2\.1\..*/);
  });
});

describe('Ruby22 Application', function() {
  it('should return its buildDependencies', () => {
    const rubyApplication = new Ruby22Application();
    const rubyBuildDep = _.find(rubyApplication.buildDependencies, bd => bd.id === 'ruby');
    expect(rubyBuildDep.installCommands[0]).to.match(/bitnami-pkg install ruby-2\.2\..*/);
  });
});

describe('Ruby24 Application', function() {
  it('should return its buildDependencies', () => {
    const rubyApplication = new Ruby24Application();
    const rubyBuildDep = _.find(rubyApplication.buildDependencies, bd => bd.id === 'ruby');
    expect(rubyBuildDep.installCommands[0]).to.match(/bitnami-pkg install ruby-2\.4\..*/);
  });
});

describe('Ruby25 Application', function() {
  it('should return its buildDependencies', () => {
    const rubyApplication = new Ruby25Application();
    const rubyBuildDep = _.find(rubyApplication.buildDependencies, bd => bd.id === 'ruby');
    expect(rubyBuildDep.installCommands[0]).to.match(/bitnami-pkg install ruby-2\.5\..*/);
  });
});
