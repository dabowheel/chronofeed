module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-browserify');
  grunt.initConfig({
    jshint: {
      options: {
        esnext: true
      },
      all: ["gruntfile.js","app.js","controllers/**/*.js","model/**/*.js","scripts/**/*.js","datastore/**/*.js"]
    },
    browserify: {
      "public/scripts/grackle.js": ["controllers/*.js", "model/*.js", "scripts/*.js"]
    }
  });

  grunt.registerTask("default",["jshint","browserify"]);
};
