'use strict';

const DrupalPlugin = require('../drupal-plugin');

const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('Drupal Plugin', function() {
  let be;
  let test;

  function createDrupalPlugin() {
    const component = helpers.createComponent(test);
    const drupalPlugin = new DrupalPlugin({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    });
    drupalPlugin.setup({be});
    return drupalPlugin;
  }

  beforeEach('prepare environment', () => {
    helpers.cleanTestEnv();
    test = helpers.createTestEnv();
    be = helpers.getDummyBuildEnvironment(test);
  });

  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });

  it('should return \'drupal/lib/plugins\' as prefix by default', () => {
    const drupalPlugin = createDrupalPlugin();
    const drupalPluginPrefix = drupalPlugin.prefix;
    expect(drupalPluginPrefix).to.match(/drupal\/lib\/plugins/);
  });
});
