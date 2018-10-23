'use strict';

const nfile = require('nami-utils').file;
const nos = require('nami-utils').os;
const MakeComponent = require('blacksmith/lib/base-components').MakeComponent;

class GoProject extends MakeComponent {
  get goImportPrefix() {
    throw new Error('unknown import path');
  }

  get goPath() {
    return super.srcDir;
  }

  get srcDir() {
    return nfile.join(this.goPath, 'src', this.goImportPrefix);
  }

  getExportableEnvironmentVariables() {
    return Object.assign(super.getExportableEnvironmentVariables(), {
      PATH: `${process.env.PATH}:${this.goPath}/bin:/usr/local/go/bin`,
      GOPATH: this.goPath,
    });
  }

  get goVersion() {
    const latestStable = nos.runProgram(
      'curl', ['-L', 'https://golang.org/VERSION?m=text']
    ).replace(/^go/, '');
    return latestStable;
  }

  get goBuildDependencies() {
    return [];
  }

  get buildDependencies() {
    const goTar = `go${this.goVersion}.linux-amd64.tar.gz`;
    const goGetCommands = this.goBuildDependencies.map((dep) => `/usr/local/go/bin/go get ${dep}`);
    return [
      {
        type: 'go',
        id: 'go',
        installCommands: [
          `curl https://dl.google.com/go/${goTar} -o ${goTar}`,
          `tar -C /usr/local -xzf ${goTar}`,
        ].concat(goGetCommands),
      }
    ];
  }

  configure() {}
}

module.exports = GoProject;
