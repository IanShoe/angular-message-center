module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			dist: 'dist'
		},
		concat: {
			dist: {
				src: ['message-center.js','message-center-templates.js'],
				dest: 'dist/message-center.js'
			}
		},
		jshint: {
			options:{
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			}
		},
		uglify: {
			// options {
			// 	mangle: false
			// },
			build: {
				src: 'dist/message-center.js',
				dest: 'dist/message-center.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['clean', 'jshint', 'concat', 'uglify'])
}