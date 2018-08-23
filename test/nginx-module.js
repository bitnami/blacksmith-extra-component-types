'use strict';

const NginxModule = require('../nginx-module');

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('Nginx Module', function() {
  let be;
  let log;
  let test;

  function createNginxModule() {
    const component = helpers.createComponent(test);
    const nginxModule = new NginxModule({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    });
    nginxModule.setup({be});
    return nginxModule;
  }

  beforeEach('prepare environment', () => {
    helpers.cleanTestEnv();
    log = {};
    test = helpers.createTestEnv();
    be = helpers.getDummyBuildEnvironment(test);
  });

  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });

  it('should output --add-module for a static module by default', () => {
    const nginxModule = createNginxModule();
    const nginxModuleFlags = nginxModule.nginxAdditionalConfigureFlags();
    expect(nginxModuleFlags).to.match(/--add-module=/);
  });
  it('should output --add-dynamic-module for a dynamic module', () => {
    const nginxModule = createNginxModule();
    nginxModule.isDynamicModule = true;
    const nginxModuleFlags = nginxModule.nginxAdditionalConfigureFlags();
    expect(nginxModuleFlags).to.match(/--add-dynamic-module=/);
  });
});
