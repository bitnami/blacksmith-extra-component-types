'use strict';

const DokuwikiPlugin = require('../dokuwiki-plugin');

const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('DokuWiki Plugin', function() {
  let be;
  let test;

  function createDokuWikiPlugin() {
    const component = helpers.createComponent(test);
    const dokuwikiPlugin = new DokuwikiPlugin({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    });
    dokuwikiPlugin.setup({be});
    return dokuwikiPlugin;
  }

  beforeEach('prepare environment', () => {
    helpers.cleanTestEnv();
    test = helpers.createTestEnv();
    be = helpers.getDummyBuildEnvironment(test);
  });

  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });

  it('should return \'dokuwiki\' as prefix by default', () => {
    const dokuwikiPlugin = createDokuWikiPlugin();
    const dokuwikiPluginPrefix = dokuwikiPlugin.prefix;
    expect(dokuwikiPluginPrefix).to.match(/dokuwiki/);
  });

  it('should return \'dokuwiki/licenses\' as licenseDir by default', () => {
    const dokuwikiPlugin = createDokuWikiPlugin();
    const dokuwikiPluginLicenseDir = dokuwikiPlugin.licenseDir;
    expect(dokuwikiPluginLicenseDir).to.match(/dokuwiki\/licenses/);
  });
});
