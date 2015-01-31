'use strict';

var path = require('path');

var dependencies = [
  'littlest-isomorph',
  'proxy-client',
  'react',
  'when'
];

module.exports = function (grunt) {
  var server;

  grunt.initConfig({
    browserify: {
      dependencies: {
        src: [],
        dest: 'public/dependencies.bundle.js',
        options: {
          require: dependencies
        }
      },
      app: {
        src: ['bin/client'],
        dest: 'public/app.bundle.js',
        options: {
          external: dependencies,
          transform: ['envify', 'reactify']
        }
      }
    },
    less: {
      client: {
        src: ['styles/bundle.less'],
        dest: 'public/bundle.css',
        options: {
          paths: function (srcFile) {
            return [
              path.dirname(srcFile),
              path.resolve(__dirname, 'node_modules')
            ];
          },
          relativeUrls: true
        }
      }
    },
    watch: {
      client: {
        files: ['bin/client'],
        tasks: ['browserify:app'],
        options: {
          atBegin: true
        }
      },
      shared: {
        files: ['data/**/*.json', 'lib/**/*.js', 'lib/**/*.jsx', 'lib/**/*.json'],
        tasks: ['browserify:app', 'server']
      },
      server: {
        files: ['bin/server', 'bin/cluster', 'public/index.html'],
        tasks: ['server'],
        options: {
          atBegin: true
        }
      },
      dependencies: {
        files: ['package.json'],
        tasks: ['browserify:dependencies', 'server']
      },
      styles: {
        files: ['styles/**/*.less'],
        tasks: ['less'],
        options: {
          atBegin: true
        }
      },
      options: {
        spawn: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('npm', function (command, arg) {
    grunt.util.spawn({
      cmd: 'npm',
      args: [command].concat(arg || []),
      opts: {
        stdio: 'inherit'
      }
    }, this.async());
  });

  grunt.registerTask('docker', function () {
    grunt.util.spawn({
      cmd: 'docker',
      args: ['build', '-t', 'littlest-github-io', '.'],
      opts: {
        stdio: 'inherit'
      }
    }, this.async());
  });

  grunt.registerTask('server', function () {
    if (server) {
      server.kill();
    }

    server = grunt.util.spawn({
      cmd: 'node',
      args: ['bin/server'],
      opts: {
        cwd: __dirname,
        stdio: 'inherit'
      }
    }, function () {});
  });

  grunt.registerTask('default', ['browserify', 'less']);
  grunt.registerTask('dev', ['browserify:dependencies', 'watch']);
  grunt.registerTask('logs', ['npm:run-script:logs']);
};
