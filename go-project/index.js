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

  get depsDir() {
    return [nfile.join(this.prefix, '../go-app-scan-config')];
  }

  getExportableEnvironmentVariables() {
    return {
      PATH: `${process.env.PATH}:${this.goPath}/bin:${process.env.HOME}/go/bin:/usr/local/go-${this.goVersion}/bin`,
      GOPATH: this.goPath,
    };
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

  get goBinaryPath() {
    return `/usr/local/go-${this.goVersion}/bin/go`;
  }

  get buildDependencies() {
    const goDestFolder = `/usr/local/go-${this.goVersion}`;
    const goTar = `go${this.goVersion}.linux-amd64.tar.gz`;
    const goGetCommands = this.goBuildDependencies.map((dep) => `${goDestFolder}/bin/go get ${dep}`);
    const buildDependencies = [
      {
        type: 'go',
        id: `go-${this.goVersion}`,
        installCommands: [
          `curl https://dl.google.com/go/${goTar} -o ${goTar}`,
          `tar -C /usr/local/ -xzf ${goTar}`,
          `mv /usr/local/go ${goDestFolder}`
        ].concat(goGetCommands),
      }
    ];
    this.goBuildDependencies.forEach((dep) => {
      buildDependencies.push({
        type: 'go',
        id: `go-${this.goVersion}-builddependency-${nfile.basename(dep)}`,
        installCommands: [`${goDestFolder}/bin/go get ${dep}`],
      });
    });
    return buildDependencies;
  }

  configure() {}
}

module.exports = GoProject;
