module.exports = function(grunt) {
	grunt.initConfig({
		ngconstant: {
		  // Options for all targets
		  options: {
		    space: '  ',
		    wrap: '"Config file for Angularjs";\n\n {%= __ngModule %}',
		    name: 'config',
		    dest: 'web/config/config.js'
		  },
		  // Environment targets
		  local: {
		    constants: {
		      ENV: {
		        name: 'local',

		        apiEndpoint: 'http://127.0.0.1:8000'

		      }
		    }
		  },
		  development: {
		    constants: {
		      ENV: {
		        name: 'development',

		        apiEndpoint: 'http://ec2-52-25-55-94.us-west-2.compute.amazonaws.com:8000'

		      }
		    }
		  },		  
		  staging: {
		    constants: {
		      ENV: {
		        name: 'staging',

		        apiEndpoint: 'http://ec2-52-26-189-52.us-west-2.compute.amazonaws.com:8000'

		      }
		    }
		  },
		  production: {
		    constants: {
		      ENV: {
		        name: 'production',
		        apiEndpoint: 'http://ec2-52-26-189-52.us-west-2.compute.amazonaws.com:8000'
		      }
		    }
		  }
		}
	});

	grunt.loadNpmTasks('grunt-ng-constant');

	grunt.registerTask('Local', [
	    'ngconstant:local'
	]);
	grunt.registerTask('Development', [
	    'ngconstant:development'
	]);
	grunt.registerTask('Staging', [
	    'ngconstant:staging'
	]);
	grunt.registerTask('Production', [
		'ngconstant:production'
	]);
};
