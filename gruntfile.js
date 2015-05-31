module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.initConfig({
    jshint: {
      all: ["gruntfile.js","index.js","public/scripts/**/*.js"]
    }
  });

  grunt.registerTask("default",["jshint"]);
};
