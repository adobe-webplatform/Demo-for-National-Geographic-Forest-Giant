module.exports = function(grunt) {

	// Configuration goes here
	grunt.initConfig({
		// Configure the copy task to move files from the development to production folders
		copy: {
			main: {
				files: [
					{
						src: ['*'],
						cwd: 'src/', 
						dest: 'www/', 
						filter: 'isFile',
						expand: true
					},
					{
						src: ['assets/**', 'css/**'],
						cwd: 'src/', 
						dest: 'www/',
						expand: true,		
					}
		      	]
			}
		},
		
		requirejs: {
			compile: {
				options: {
					name: "main",
		    		baseUrl: "src/js/",
			        mainConfigFile: "src/js/config.js",
		    		out: "www/js/main.js"
				}
			}
		}
	});

	// Load plugins here
	//grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib');

	// Define your tasks here
	grunt.registerTask('default', ['copy', 'requirejs']);

};