/**
* Puropse- for environment configuration
* Author- Akash Jain
*/

var env = require('./env.json');
var fs = require('fs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//var model = require('../dao/db.js');

/** 
* @function getEnv()
* here returning current node environment name.
*/
exports.getEnv = function() {
	var node_env = process.env.NODE_ENV || 'development';
	return node_env;
};

/**
* @function  options() 
* here returning environment settings  from json file 
* according to specify evironment.
*/
exports.options = function() {
	var node_env = this.getEnv();
	return env[node_env];
};

/**
* @function loglevel()
* returning loglevel for current environment.
*/
exports.loglevel = function() {
	return this.options().loglevel;
};

/*exports.creatingDirectory = function() {
	if(!fs.existsSync("./images/group-photos/")) {
		fs.mkdirSync("./images/group-photos/","0766", function(error) {
			if(error) {
				logger.error("Can't make images directory"+error);		
			} 
		});
	} 
	if(!fs.existsSync("./images/user-photos/")) {
		fs.mkdirSync("./images/user-photos/","0766", function(error) {
			if(error) {
				logger.error("Can't make images directory"+error);		
			} 
		});
	} 
};*/


/**
* @function sessionOption()
* returning sessionObj to set session attributes.
*/

exports.sessionOption = function() {
	var sessionObj = {
		cookie: { maxAge: 15 * 24 * 60 * 60 * 1000, path : '/user/login'} ,
    	secret: "Dna" ,
    	saveUninitialized: false,
	    resave: false,
    	store:new MongoStore({
        	db:'Dna',
        	mongooseConnection : model.mongoConnection, 
        	collection : 'session', 
        	autoReconnect : true,
        	stringify:false,
        	autoRemove: 'enabled',
        	touchAfter: 15 * 24 * 60 * 60 * 1000
    	})
	}
	return sessionObj;
};
