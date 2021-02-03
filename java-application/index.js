'use strict';

const MakeComponent = require('blacksmith/lib/base-components').MakeComponent;

class JavaApplication extends MakeComponent {
  javaVersion() { return '11.0.10-0'; }

  mavenVersion() { return '3.6.3'; }

  antVersion() { return '1.10.9'; }

  configure() {}

  get buildDependencies() {
    const mavenTar = `apache-maven-${this.mavenVersion()}-bin.tar.gz`;
    const antTar = `apache-ant-${this.antVersion()}-bin.tar.gz`;

    const buildDependencies = [
      {
        'type': 'nami',
        'id': 'java',
        'installCommands': [`bitnami-pkg install java-${this.javaVersion()}`],
        'envVars': {
          PATH: '$PATH:/opt/bitnami/java/bin',
          JAVA_HOME: '/opt/bitnami/java/bin',
        },
      },
      {
        'type': 'buildtool',
        'id': 'maven',
        'installCommands': [
          `curl -LO https://apache-mirror.rbc.ru/pub/apache/maven/maven-3/${this.mavenVersion()}/binaries/${mavenTar}`,
          `tar -C /usr/local/ -xzf ${mavenTar}`
        ],
        'envVars': {
          PATH: `$PATH:/usr/local/apache-maven-${this.mavenVersion()}/bin`,
        },
      },
      {
        'type': 'buildtool',
        'id': 'ant',
        'installCommands': [
          `curl -LO https://apache-mirror.rbc.ru/pub/apache/ant/binaries/${antTar}`,
          `tar -C /usr/local/ -xzf ${antTar}`
        ],
        'envVars': {
          PATH: `$PATH:/usr/local/apache-ant-${this.antVersion()}/bin`,
        },
      },
    ];

    return buildDependencies;
  }
}

module.exports = JavaApplication;
