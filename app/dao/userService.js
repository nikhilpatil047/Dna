/**
* Purpose- defining user's related services.
* Author-Nikhil Patil
*/
var model = require('./db.js');
var crypto = require('crypto');
var path = require('path');
var appUtils = require('../utils/appUtils.js');
var constants = require('../utils/constants.js');
var responseUtils = require('../utils/responseUtils');

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
		user_type: req.usertype,
		building_name: req.buildingName || null,
		building_website: req.buildingWebsite || null,
		address: req.address,
		security_question: req.securityquestion || null,
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

//To fetch User
function getUserByUserName(uname, callback) {
	logger.debug("<<<<<<<<<<<<<<<<<<< In getUserByEmailId Method >>>>>>>>>>>>>>>>>>>>>"+ uname);
	//var name = params.useremail ;
	model.Users.findOne({ username : uname }, function(err, data){
    	if(err) {
    		logger.error(err.message);
    		var errorMessage = {
						"code" : appUtils.getErrorMessage("ERROR_IN_DATABASE_OPERATION").ERROR_CODE,
						"message" : appUtils.getErrorMessage("ERROR_IN_DATABASE_OPERATION").ERROR_MESSAGE
					}	
    		callback(errorMessage,null);
    	} else {
    		logger.debug(">>>>>>>>>>>>>>>>> User <<<<<<<<<<<<<<<<< " + JSON.stringify(data));
    		callback(null,data);
    	}
 	}); 
};
var userLogin = function(request, callback) {	
	var encPassword;
	if(!appUtils.isBlank(request.body.payload.password)) {
		encPassword = encryptPassword(request.body.payload.password); 
	}
	var userName = request.body.payload.userName;
	getUserByUserName(userName,function(err,resultSet) {	
 
		var resp = responseUtils.constructResponseJson();
		
		if(err === null) {
			if(resultSet === null){
				resp.payload.status = "ERROR";
				resp.payload.responseCode = appUtils.getErrorMessage("USER_NOT_EXIST").ERROR_CODE;
				resp.payload.responseBody.message = appUtils.getErrorMessage("USER_NOT_EXIST").ERROR_MESSAGE;

			}else{
				if(encPassword === resultSet.password){
					resp.payload.status = "SUCCESS";
					resp.payload.responseCode = "200";
					resp.payload.responseBody.userDetails = {};
					request.session = {};
					request.session["userName"] = request.body.payload.userName;
					request.session["sessionId"] = appUtils.generateToken();
					resp.payload.responseBody.userDetails['firstName'] = resultSet.first_name;
					resp.payload.responseBody.userDetails['lastName'] = resultSet.last_name;
					resp.payload.responseBody.userDetails['address'] = resultSet.address;
					resp.payload['sessionId'] = request.session.sessionId;
					console.log(JSON.stringify(request.session));
				}else{
					resp.payload.status = "ERROR";
					resp.payload.responseCode = appUtils.getErrorMessage("INCORRECT_PASSWORD").ERROR_CODE;
					resp.payload.responseBody.message = appUtils.getErrorMessage("INCORRECT_PASSWORD").ERROR_MESSAGE;
				}

			}
		}		
		
		callback(resp);
	});
}
module.exports.signup = signup;
module.exports.userLogin = userLogin;