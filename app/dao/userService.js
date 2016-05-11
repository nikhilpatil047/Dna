/**
* Purpose- defining user's related services.
* Author-Nikhil Patil
*/
var model = require('./db.js');
var crypto = require('crypto');
var path = require('path');
var appUtils = require('../utils/appUtils.js');
var constants = require('../utils/constants.js');

// Global module level variables.
var SERVICE_NAME = 'UserManagementServices: ';

//To encrypt password in hexa form.
function encryptPassword (pass) {

	try {
		var hash = crypto	
	    .createHash("md5")
	    .update(pass)
	    .digest('hex');
		return hash;
	}catch(error) {
	  logger.error("Error in encryptPassword Method :"+error.message);
	}

} 
//To save user
function saveUser(document,callback) {
	document.save(function(err) {
		logger.debug("In saveUser method");
		if(err) {
				logger.error(" In saveUser  method >> error >> " + err);
				//callback(err,null);
		} 
		callback(null,document._id);
	});
};

function signup(req, res, callback) {
	var METHOD_NAME = "signup()";
	logger.info('<<<<<<<<<<<<<<' + SERVICE_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	logger.debug("Rquest : " + JSON.stringify(req));
	
	// calling encryptPassword method.	
	var password = encryptPassword(req.password); 

	// Initializing variables from request body and setting default values.
	var document = {
		username : req.username || null ,
		first_name : null,
		last_name : null,		
		password : password,
		profile_photo : null,
		building_name: req.buildingName || null,
		building_website: req.buildingWebsite || null,
		address: req.address,
		security_question: {question: req.question || null, answer: req.answer || null },
		notificationTypes : {
			forgotPassword : true
		},		
		created_date : new Date() || null
	}

	//here passing document to compare it with specified schema in db.js file
	var user ;
	try {
		user = model.Users(document);
		saveUser(user,function(err,id) {
		 	if(err) {
				callback(err);
		 	}else if(id)	{
		 		return callback(null, constants.REGISTRATION_SUCCESS_RESP);
		 	}				 	
		});
		
	}
	catch(error) {
		logger.error("User data not inserted" + error);
		return callback(error,null);
	}
	logger.info('<<<<<<<<<<<<<<' + SERVICE_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

module.exports.signup = signup;
