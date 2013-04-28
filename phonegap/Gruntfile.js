module.exports = function(grunt) {

	// Configuration goes here
	grunt.initConfig({
		// Configure the copy task to move files from the development to production folders
		requirejs: {
			compile: {
				options: {
					name: "main",
		    		baseUrl: "www/js/",
			        mainConfigFile: "www/js/config.js",
		    		out: "www/js/main.min.js"
				}
			}
		}
	});

	// Load plugins here
	//grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib');

	// Define your tasks here
	grunt.registerTask('default', ['requirejs']);

};