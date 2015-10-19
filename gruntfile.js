module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-jasmine-nodejs');

  grunt.initConfig({
    jshint: {
      options: {
        esnext: true
      },
      all: ["gruntfile.js","app.js","controllers/**/*.js","model/**/*.js","scripts/**/*.js","datastore/**/*.js"]
    },
    browserify: {
      "public/scripts/grackle.js": ["controllers/*.js", "model/*.js", "scripts/*.js"]
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

  grunt.registerTask("default",["jshint","browserify","jasmine_nodejs"]);
};
