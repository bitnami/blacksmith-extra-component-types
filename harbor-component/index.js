'use strict';

const nos = require('nami-utils').os;
const CompiledComponent = require('blacksmith/lib/base-components').CompiledComponent;
const GoProject = require('../go-project');

function getVersionFromHarbor(componentToParse, componentRegex, harborVersion, logger) {
  const harborMakefileURL = `https://raw.githubusercontent.com/goharbor/harbor/v${harborVersion}/Makefile`;
  const curlOutput = nos.runProgram('curl', ['-Lk', harborMakefileURL], {retrieveStdStreams: true});
  const parsedVersion = curlOutput.stdout.match(componentRegex);
  if (!parsedVersion || !parsedVersion[1]) {
    throw new Error(`Could not parse ${componentToParse} version from ${harborMakefileURL}`);
  }
  logger.info(`Parsed ${componentToParse} version ${parsedVersion[1]} from ${harborMakefileURL}`);
  return parsedVersion[1];
}

class HarborComponent extends CompiledComponent {
  _getVersionFromHarbor(componentToParse, componentRegex) {
    return getVersionFromHarbor(componentToParse, componentRegex, this.version, this.logger);
  }
}

class HarborGoComponent extends GoProject {
  _getVersionFromHarbor(componentToParse, componentRegex) {
    return getVersionFromHarbor(componentToParse, componentRegex, this.version, this.logger);
  }
}

module.exports = {
  HarborComponent,
  HarborGoComponent,
};
