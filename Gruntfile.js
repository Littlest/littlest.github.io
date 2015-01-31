'use strict';

// Transparently allow require-ing `component.jsx`.
require('node-jsx').install({ extension: '.jsx' });

var fs = require('fs');
var path = require('path');
var littlest = require('littlest-isomorph');
var vm = require('vm');

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
        files: ['lib/**/*.js', 'lib/**/*.jsx', 'lib/**/*.json'],
        tasks: ['browserify:app', 'grunt:index']
      },
      dependencies: {
        files: ['package.json'],
        tasks: ['browserify:dependencies']
      },
      index: {
        files: ['_index.html'],
        tasks: ['grunt:index']
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

  grunt.registerTask('grunt', function (command) {
    grunt.util.spawn({
      cmd: 'grunt',
      args: [command],
      opts: {
        stdio: 'inherit'
      }
    }, this.async());
  });

  grunt.registerTask('index', function () {
    var context = require('./lib/context');
    var renderer = littlest.StaticRenderer.createRenderer({
      templatePath: path.resolve(__dirname, '_index.html')
    });

    fs.writeFileSync(
      path.resolve(__dirname, 'index.html'),
      renderer.render(context.router.getRoute('/'), context)
    );
  });

  grunt.registerTask('default', ['browserify', 'less', 'index']);
  grunt.registerTask('dev', ['browserify:dependencies', 'index', 'watch']);
};
