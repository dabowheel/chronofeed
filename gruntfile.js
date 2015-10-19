module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.initConfig({
    jshint: {
      options: {
        esnext: true
      },
      all: ["gruntfile.js","app.js","controllers/**/*.js","model/**/*.js","scripts/**/*.js","datastore/**/*.js"]
    }
  });

  grunt.registerTask("default",["jshint"]);
};
