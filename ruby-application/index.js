'use strict';

const nfile = require('nami-utils').file;
const nutil = require('nami-utils').util;
const _ = require('nami-utils/lodash-extra');
const CompilableComponent = require('blacksmith/lib/base-components').CompilableComponent;

/**
 * Class representing a Ruby Application
 * @namespace BaseComponents.RubyApplication
 * @class
 * @extends CompilableComponent
 */
class RubyApplication extends CompilableComponent {
  get buildDependencies() {
    const debianPackages = [
      'imagemagick',
      'ghostscript',
      'libc6',
      'libmagickwand-dev',
      'default-libmysqlclient-dev',
      'libpq-dev',
      'libxml2-dev',
      'libxslt1-dev',
      'libgmp-dev',
      'zlib1g-dev',
    ];
    const debianSpecialDeps = [
      {
        type: 'system',
        id: 'libmysqlclient18',
        distro: 'debian',
        version: 8,
      },
      {
        type: 'system',
        id: 'default-libmysqlclient-dev',
        distro: 'debian',
        version: 9,
      },
    ];
    return [
      {
        'type': 'nami',
        'id': 'ruby',
        'installCommands': [`bitnami-pkg install ruby-${this.rubyVersion()}`],
        'envVars': {
          PATH: '$PATH:/opt/bitnami/ruby/bin'
        }
      },
    ].concat(_.map(debianPackages, pkg => {
      return {'type': 'system', 'id': pkg, distro: 'debian'};
    })).concat(debianSpecialDeps);
  }

  /**
   * Ruby version to build
   * @function RubyApplication~rubyVersion
   * @returns {String} Ruby version to build.
   */
  rubyVersion() {
    return '2.3.7-0';
  }

  /**
   * Create prefix and copy source files
   * @function RubyApplication~build
   */
  build() {
    nfile.mkdir(this.prefix);
    nfile.copy(nfile.join(this.srcDir, '*'), this.prefix);
    if (nfile.exists(nfile.join(this.prefix, 'config/database.yml.example')) &&
    !nfile.exists(nfile.join(this.prefix, 'config/database.yml'))) {
      nfile.rename(
          nfile.join(this.prefix, 'config/database.yml.example'),
          nfile.join(this.prefix, 'config/database.yml'));
    }
  }
  getEnvVariables() {
    const vars = super.getEnvVariables();
    vars.LDFLAGS += ` -Wl,-rpath=${this.be.prefixDir}/common/lib`;
    return vars;
  }
  /**
   * Additional gems to install not present in the Gemfile.
   * @function BaseComponents.RubyApplication~additionalGems
   * @returns {Array} Gems to add. Empty by default.
   */
  additionalGems() {
    return [];
  }
  /**
   * Install the ruby application. Download and install gems
   * @function BaseComponents.RubyApplication~install
   * @param {Object} [options]
   * @param {Object} [options.installPassenger] - Download and install Passenger
   * @param {Array} [options.exclude=['development', 'sqlite', 'test']] - Groups to exclude
   */
  install(options) {
    options = _.defaults(options || {}, {installPassenger: true, exclude: ['development', 'sqlite', 'test']});
    const _additionalGems = this.additionalGems();
    if (!nfile.contains(nfile.join(this.prefix, 'Gemfile'), 'passenger') && options.installPassenger) {
      _additionalGems.push('passenger');
    }
    if (!_.isEmpty(_additionalGems)) {
      nfile.puts(nfile.join(this.prefix, 'Gemfile'), _.map(_additionalGems, gem => `gem "${gem}"`).join('\n'),
      {atNewLine: true});
    }
    const args = ['install', '--binstubs', '--without'].concat(options.exclude);
    this.sandbox.runProgram(nfile.join(this.be.prefixDir, 'ruby/bin/bundle'),
                                         args.concat('--no-deployment'), {cwd: this.prefix});
    this.sandbox.runProgram(nfile.join(this.be.prefixDir, 'ruby/bin/bundle'),
                                         args.concat(['--deployment', '--path=vendor/bundle']), {cwd: this.prefix});
    if (options.installPassenger) {
      // Passenger first boot to download agent and Nginx
      this.sandbox.runProgram(nfile.join(this.be.prefixDir, 'ruby/bin/bundle'), ['exec', 'passenger', 'start'], {
        env: {PATH: `${process.env.PATH}:${nfile.join(this.be.prefixDir, 'ruby/bin')}`},
        runInBackground: true, cwd: this.prefix});
      const logFile = nfile.join(this.prefix, 'log/passenger.3000.log');
      let started = false;
      const timeout = 20;
      let cont = 0;
      while (!started && cont < timeout) {
        if (nfile.exists(logFile)) {
          if (_.includes(nfile.read(logFile), 'Passenger core online')) started = true;
        }
        cont += 1;
        nutil.sleep(1);
      }
      if (!started) throw new Error('Passenger failed to start');
      this.sandbox.runProgram(nfile.join(this.be.prefixDir, 'ruby/bin/bundle'), ['exec', 'passenger', 'stop'], {
        env: {PATH: `${process.env.PATH}:${nfile.join(this.be.prefixDir, 'ruby/bin')}`}, cwd: this.prefix});
    }
  }
  /**
   * Additionally remove log files and Ruby cache
   * @function BaseComponents.RubyApplication~minify
   */
  minify() {
    super.minify();
    nfile.delete(nfile.join(this.prefix, 'log/*'));
    nfile.delete(nfile.join(this.prefix, 'vendor/bundle/ruby/*/cache'));
    // Delete unnecesary folders from ruby gems with precompiled binaries for unsupported platforms
    _.forEach(['darwin*', 'freebsd*', 'openbsd*', 'linux-i686', 'linux/i686'], value => {
      nfile.delete(nfile.join([this.prefix, 'vendor/bundle/ruby/*/gems/*/vendor/', value]));
    });
  }
}

module.exports = RubyApplication;
