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
    const dokuwikiPlugin = new DokuWikiPlugin({
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

  it('should return \'dokuwiki/lib/plugins\' as prefix by default', () => {
    const dokuwikiPlugin = createDokuWikiPlugin();
    const dokuwikiPluginPrefix = dokuwikiPlugin.prefix;
    expect(dokuwikiPluginPrefix).to.match(/dokuwiki\/lib\/plugins/);
  });
});
