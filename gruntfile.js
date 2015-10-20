module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-browserify');
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jasmine-nodejs');

  grunt.initConfig({
    jshint: {
      options: {
        esnext: true
      },
      all: ["gruntfile.js","app.js","controllers/**/*.js","model/**/*.js","scripts/**/*.js","datastore/**/*.js"]
    },
    eslint: {
        target: ["*.js", "controllers/**/*.js", "model/**/*.js", "scripts/**/*.js"]
    },
    browserify: {
      "public/scripts/grackle.js": ["controllers/*.js", "model/*.js", "scripts/*.js"]
    },
    babel: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'public/scripts/grackle.5.js': 'public/scripts/grackle.js'
            }
        }
    },
    uglify: {
      grackle: {
        files: {
          'public/scripts/grackle.5.min.js': ["public/scripts/grackle.5.js"]
        }
      }
    },
    jasmine_nodejs: {
      // task specific (default) options
      options: {
          specNameSuffix: "spec.js", // also accepts an array
          helperNameSuffix: "helper.js",
          useHelpers: false,
          stopOnFailure: false,
          // configure one or more built-in reporters
          reporters: {
              console: {
                  colors: true,
                  cleanStack: 1,       // (0|false)|(1|true)|2|3
                  verbosity: 4,        // (0|false)|1|2|3|(4|true)
                  listStyle: "indent", // "flat"|"indent"
                  activity: false
              }
          },
          customReporters: []
      },
      grackle: {
       // target specific options
        options: {
              useHelpers: true
          },
          // spec files
          specs: [
              "controllers/spec/**",
              "model/spec/**",
              "scripts/spec/**"
          ],
          helpers: [
              "test/helpers/**"
          ]
      }
    }
  });

  grunt.registerTask("default",["jshint","eslint","browserify","babel","uglify","jasmine_nodejs"]);
};
