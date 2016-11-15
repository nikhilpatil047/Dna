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
					request.session["username"] = request.body.payload.userName;
					request.session["sessionId"] = appUtils.generateToken();
					resp.payload.responseBody.userDetails['id'] = resultSet._id;
					resp.payload.responseBody.userDetails['address'] = resultSet.address;
					resp.payload.responseBody.userDetails['buildingWebsite'] = resultSet.building_website;
					resp.payload.responseBody.userDetails['buildingName'] = resultSet.building_name;
					resp.payload['session'] = request.session;
					console.log("session >>> "+JSON.stringify(request.session));
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

//To Delete session etry and ogout user
function logout(sessionId, callback) {
	logger.debug("USER DAO : " + sessionId);

	model.Session.remove({"session.sessionId" : sessionId }, function(err,result) {
		if (err) {
			logger.debug(JSON.stringify(err));
			var errorMessage = {
				"code" : appUtils.getErrorMessage("ERROR_IN_DATABASE_OPERATION").ERROR_CODE,
				"message" : appUtils.getErrorMessage("ERROR_IN_DATABASE_OPERATION").ERROR_MESSAGE
			}
		   	callback(errorMessage, null);
		}
		// Parse json result set.
		result = JSON.parse(result);		

		// Check if session exist or not.
		if(result.n == 1) {
		   	callback(null,true);
		} else {
			var errorMessage = {
				"code" : appUtils.getErrorMessage("SESSION_NOT_EXIST").ERROR_CODE,
				"message" : appUtils.getErrorMessage("SESSION_NOT_EXIST").ERROR_MESSAGE
			}
		   	callback(errorMessage, null);
		}
 	});  
}

//To fetch User Details
function getUserById(uId, callback) {
	logger.debug("<<<<<<<<<<<<<<<<<<< In getUserById Method >>>>>>>>>>>>>>>>>>>>>"+ uId);
	//var name = params.useremail ;
	model.userDetail.findOne({ userid : uId }, function(err, data){
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

//To save user details
function saveUserDetail(document,callback) {
	document.save(function(err) {
		logger.debug("In saveUser method");
		if(err) {
				logger.error(" In saveUser  method >> error >> " + err);
				//callback(err,null);
		} 
		callback(null,document);
	});
};

//To update User Details.
function updateUser(userID, queryString ,callback ) {
	logger.debug("<<<<<<<<<<<<<<<<<<<In updateUser  Method>>>>>>>>>>>>>>>>>>>>>" + userID + " >> " + JSON.stringify(queryString));
	model.userDetail.update( { userid : new ObjectId(userID)}, { $set :  queryString },function(err,result) {
		if (err) {
			logger.error(err.message);
			console.log(">>>>"+ JSON.stringify(err));
			callback(errorMessage, null);
		}
		if(result.n == 1) {
			callback(null,true);
		}else {	
			callback(appUtils.getErrorMessage("USER_UPDATION_ERROR").ERROR_CODE, null);
		}
	});
};

//To save Building details
function saveBuildingDetail(document,callback) {
	document.save(function(err) {
		logger.debug("In saveBuilding method");
		if(err) {
				logger.error(" In saveBuilding  method >> error >> " + err);
				//callback(err,null);
		} 
		callback(null,document);
	});
};

//To update Building Details.
function updateBuilding(id, queryString ,callback ) {
	logger.debug("<<<<<<<<<<<<<<<<<<<In updateBuilding  Method>>>>>>>>>>>>>>>>>>>>>" + id + " >> " + JSON.stringify(queryString));
	model.building.update( { id : id}, { $set :  queryString },function(err,result) {
		if (err) {
			logger.error(err.message);
			console.log(">>>>"+ JSON.stringify(err));
			callback(errorMessage, null);
		}
		if(result.n == 1) {
			callback(null,true);
		}else {	
			callback(appUtils.getErrorMessage("USER_UPDATION_ERROR").ERROR_CODE, null);
		}
	});
};

//To fetch User Details
function getAllBulidings(callback) {
	logger.debug("<<<<<<<<<<<<<<<<<<< In getAllBulidings Method >>>>>>>>>>>>>>>>>>>>>");
	//var name = params.useremail ;
	model.building.find({}, function(err, data){
    	if(err) {
    		logger.error(err.message);
    		var errorMessage = {
						"code" : appUtils.getErrorMessage("ERROR_IN_DATABASE_OPERATION").ERROR_CODE,
						"message" : appUtils.getErrorMessage("ERROR_IN_DATABASE_OPERATION").ERROR_MESSAGE
					}	
    		callback(errorMessage,null);
    	} else {
    		logger.debug(">>>>>>>>>>>>>>>>> data <<<<<<<<<<<<<<<<< " + JSON.stringify(data));
    		callback(null,data);
    	}
 	}); 
};

//To save Tax Template details
function saveTaxDetail(document,callback) {
	document.save(function(err) {
		logger.debug("In saveTaxDetail method");
		if(err) {
				logger.error(" In saveTaxDetail  method >> error >> " + err);
				//callback(err,null);
		} 
		callback(null,document);
	});
};

//To update tax Details.
function updateTaxDetails(id, queryString ,callback ) {
	logger.debug("<<<<<<<<<<<<<<<<<<<In updateTaxDetails  Method>>>>>>>>>>>>>>>>>>>>>" + id + " >> " + JSON.stringify(queryString));
	model.taxTemplate.update( {building_id : id}, { $set :  queryString },function(err,result) {
		if (err) {
			logger.error(err.message);
			console.log(">>>>"+ JSON.stringify(err));
			callback(errorMessage, null);
		}
		if(result.n == 1) {
			callback(null,true);
		}else {	
			callback(appUtils.getErrorMessage("USER_UPDATION_ERROR").ERROR_CODE, null);
		}
	});
};

//To fetch Tax Template Details
function getTaxDetails(id, callback) {
	logger.debug("<<<<<<<<<<<<<<<<<<< In getTaxDetails Method >>>>>>>>>>>>>>>>>>>>>");
	//var name = params.useremail ;
	model.taxTemplate.find({building_id : id}, function(err, data){
    	if(err) {
    		logger.error(err.message);
    		var errorMessage = {
						"code" : appUtils.getErrorMessage("ERROR_IN_DATABASE_OPERATION").ERROR_CODE,
						"message" : appUtils.getErrorMessage("ERROR_IN_DATABASE_OPERATION").ERROR_MESSAGE
					}	
    		callback(errorMessage,null);
    	} else {
    		logger.debug(">>>>>>>>>>>>>>>>> data <<<<<<<<<<<<<<<<< " + JSON.stringify(data));
    		callback(null,data);
    	}
 	}); 
};

module.exports.signup = signup;
module.exports.userLogin = userLogin;
module.exports.logout = logout;
module.exports.getUserById = getUserById;
module.exports.saveUserDetail = saveUserDetail;
module.exports.updateUser = updateUser;
module.exports.saveBuildingDetail = saveBuildingDetail;
module.exports.updateBuilding = updateBuilding;
module.exports.getAllBulidings = getAllBulidings;
module.exports.getTaxDetails = getTaxDetails;
module.exports.updateTaxDetails = updateTaxDetails;
module.exports.saveTaxDetail = saveTaxDetail;
