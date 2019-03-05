'use strict';

const WordPressPlugin = require('../wordpress-plugin');

const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('WordPress Plugin', function() {
  let be;
  let test;

  function createWordPressPlugin() {
    const component = helpers.createComponent(test);
    const wordpressPlugin = new WordPressPlugin({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    });
    wordpressPlugin.setup({be});
    return wordpressPlugin;
  }

  beforeEach('prepare environment', () => {
    helpers.cleanTestEnv();
    test = helpers.createTestEnv();
    be = helpers.getDummyBuildEnvironment(test);
  });

  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });

  it('should return \'wordpress/wp-content/plugins\' as prefix by default', () => {
    const wordpressPlugin = createWordPressPlugin();
    const wordpressPluginPrefix = wordpressPlugin.prefix();
    expect(wordpressPluginPrefix).to.match(/wordpress\/wp-content\/plugins/);
  });
});
