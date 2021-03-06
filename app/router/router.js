/**
* Purpose- Defining routes and logic
* Author- Nikhil Patil
*/
var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var responseUtils = require('../utils/responseUtils.js');
var validationUtils = require('../utils/validationUtils.js');
var jsonUtils = require('../utils/jsonUtils.js');
var userService = require('../dao/userService.js');
var model = require('../dao/db.js');
var constants = require('../utils/constants.js');
var async = require('async');


router.post('/login', authentication);
router.post('/createuser', createuser);
router.post('/logout', logout);
router.post('/addDetails', createUserDetail);
router.post('/getUserDetail', fetchUserDetail);
router.post('/getUsersByBuilding', fetchUserByBuilding);
router.put('/updateDetail', updateDetail);
router.post('/addBuilding', addBuild);
router.post('/getAllBuildings', fetchAllBuild);
router.put('/updateBuildingDetail', updateBuildingDetail);
router.post('/getTaxTemplate', fetchTemplate);
router.post('/addTaxTemplate', addTemplate);
router.put('/updateTaxTemplate', updateTemplate);
router.post('/addTaxInvoices', addInvoices);
router.post('/getTaxInvoicesByBuilding', fetchInviocesForBuilding);
router.post('/getTaxInvoicesByUser', fetchInviocesForUser);



/**
 * Checking useremail value is empty or not, if not then passing 
 * to user service layer.
 **/

var CONTROLLER_NAME = 'Router: ';

function createuser(request, response) {
	var METHOD_NAME = "CreateUser()";
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	logger.debug("================= Create User =================");
	var finalResponse = responseUtils.constructResponseJson();

	try {
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = request.body.payload;					

				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateSignUpRequest(payload);

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					finalResponse.payload.status = "ERROR";
					finalResponse.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	finalResponse.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	response.send(finalResponse);
				}

				payload['protocol'] = request.protocol;
				payload['host'] = request.get('host');
				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},

			function registerUser(requestParams, registrationCallback) {

				userService.signup(requestParams, response, function (err, data) {
					if(err) {
						finalResponse.payload.status = "WARNING";
						finalResponse.payload.responseCode = err.code;
				    	finalResponse.payload.responseBody.message = err.message;					    	
					}

					else {							
						finalResponse.payload.status = "SUCCESS";
						finalResponse.payload.responseCode = constants.RESPONSE_SUCCESS;
				    	finalResponse.payload.responseBody['message'] = data;					    	
				 	}
					logger.debug(JSON.stringify(finalResponse));
					registrationCallback(null, finalResponse);
				});
			}
		], function (error, finalResponse) {
			response.send(finalResponse);		
		});
	} catch(error) {
		finalResponse.payload['responseCode'] = '400';
		finalResponse.payload.responseBody['message'] = 'User Registration Failed.';
		finalResponse['status'] = "ERROR";

		response.send(finalResponse);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};


/**
 * Authentication endpoint API.
 * 
 * @param requestParams - Object consist of request parameters from client app.
 * @return callback - Callback function which can generate the final client response.
 */
function authentication (requestParam, resp) {
	var METHOD_NAME = 'authentication(): ';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	var res = {
		payload: {
    		responseType: "application/json",
    		responseCode: "200",
   		    responseBody: {
       			 
   			 }
			 }
	};

	try {			
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = requestParam.body.payload;					
				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateAuthenticationRequest(payload);					

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					res.payload.status = "ERROR";
					res.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	res.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	resp.send(res);
				}

				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},
			// Function to authenticate users. 
			function authenticateUser(requestParams, authenticateCallback) {					

				var userName = jsonUtils.getPath(requestParams, 'userName');
				var password = jsonUtils.getPath(requestParams, 'password');					

				userService.userLogin(requestParam, function(respo) {
					console.log("inauth >>>")
					authenticateCallback(null, respo);					
				});
			}
			
		], function (error, response) {
			
			// Construct success response object and send back to the client.
			if(response.payload.responseCode != '200') {
				if(requestParam.session){
					requestParam.session.destroy();
				}	
			}

			resp.send(response);
		});
	}catch(error) {

		res.payload['responseCode'] = '400';
		res.payload.responseBody['message'] = 'User Authentication Failed';
		res['status'] = "ERROR";
		resp.send(res);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/*
 * Logout function to destroy session.
 * 
 */
function logout(requestParams, response) {
	var METHOD_NAME = 'Logout()';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	logger.debug(JSON.stringify(requestParams.body));
	
	// Final response structure.	
	var finalResponse = responseUtils.constructResponseJson();

	// Call to DAO layer to check and destory session.
	userService.logout(requestParams.body.header.sessionId, function(error, resp) {

		if (error) {
			// Massage & send Error response on unsuccessful logout.
			finalResponse.status = constants.STATUS_ERROR;
			finalResponse.payload.responseCode = error.code;
			finalResponse.payload.responseBody['message'] = error.message;
			response.send(finalResponse);
		}else {
			// Massage & send success response on successful logout.
			finalResponse.status = constants.STATUS_SUCCESS;
			finalResponse.payload.responseCode = constants.RESPONSE_SUCCESS;
			finalResponse.payload.responseBody['message'] = constants.LOGOUT_SUCCESSFUL;
			response.send(finalResponse);
		}			
	});
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/* 
 * Function to check if session is valid or not.
 * Query Param : sessionId
 */
function isValidSession(request, response) {
	var METHOD_NAME = "isValidSession();"
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	// Final response structure.	
	var finalResponse = responseUtils.constructResponseJson();

	logger.debug("sessionId : " + request.query.sessionId);

	try {
		// Check if session is valid or not.
		sessionDao.validSession(request.query.sessionId, function(error, res) {						
			if(res) {
				finalResponse.payload.responseCode = constants.RESPONSE_SUCCESS;
				finalResponse.payload.status = constants.STATUS_SUCCESS;
				finalResponse.payload.responseBody['sessionId'] = request.query.sessionId;
				response.send(finalResponse);
			}else {							
				finalResponse.payload.responseCode = error.code;
				finalResponse.payload.status = constants.STATUS_ERROR;
				finalResponse.payload.responseBody['sessionId'] = null;
				response.send(finalResponse);
			}
		});
	}catch(error) {
		logger.debug("Exception Thrown" + JSON.stringify(error));
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
}

/*
* Function to add user details.
*
*/
function createUserDetail(request, response) {
	var METHOD_NAME = "createUserDetail()";
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	logger.debug("================= Create User =================");
	var finalResponse = responseUtils.constructResponseJson();

	try {
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = request.body.payload;					

				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateSignUpRequest(payload);

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					finalResponse.payload.status = "ERROR";
					finalResponse.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	finalResponse.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	response.send(finalResponse);
				}

				payload['protocol'] = request.protocol;
				payload['host'] = request.get('host');
				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},

			function registerUserDetails(requestParams, registrationCallback) {
				// Initializing variables from request body and setting default values.
				var document = {
					userid: requestParams.uId,
					first_name: requestParams.fName,
					last_name : requestParams.lName,
					email: requestParams.email,
					contactno: requestParams.contact,
					birth_date: requestParams.dob,
					flatno: requestParams.flatno
				}

				//here passing document to compare it with specified schema in db.js file
				var user ;
				try {
					user = model.userDetail(document);
					userService.saveUserDetail(user, function (err, data) {
						if(err) {
							finalResponse.payload.status = "WARNING";
							finalResponse.payload.responseCode = err.code;
					    	finalResponse.payload.responseBody.message = err.message;					    	
						}
						else {							
							finalResponse.payload.status = "SUCCESS";
							finalResponse.payload.responseCode = constants.RESPONSE_SUCCESS;
					    	finalResponse.payload.responseBody['message'] = "User Details added successfully.";	
					    	finalResponse.payload.responseBody.userDetails = {
					    		'id': data.userid,
								'fName': data.first_name,
								'lName': data.last_name,
								'contact': data.contactno,
								'dob': data.birth_date,
								'flatno': data.flatno,
								'email': data.email
					    	}
					 	}
						logger.debug(JSON.stringify(finalResponse));
						registrationCallback(null, finalResponse);
					});
				}
				catch(error) {
					logger.error("User data not inserted" + error);
					registrationCallback(error,null);
				}	
			}
		], function (error, finalResponse) {
			response.send(finalResponse);		
		});
	} catch(error) {
		finalResponse.payload['responseCode'] = '400';
		finalResponse.payload.responseBody['message'] = 'User Details Registration Failed.';
		finalResponse['status'] = "ERROR";

		response.send(finalResponse);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/*
* Function to fetch user details.
*
*/
function fetchUserDetail(requestParam, response) {
	var METHOD_NAME = 'fetchUserDetail(): ';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	var res = {
		payload: {
    		responseType: "application/json",
    		responseCode: "200",
   		    responseBody: {
       			 
   			 }
			 }
	};

	try {			
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = requestParam.body.payload;					
				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateAuthenticationRequest(payload);					

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					res.payload.status = "ERROR";
					res.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	res.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	resp.send(res);
				}

				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},
			// Function to authenticate users. 
			function authenticateUser(requestParams, authenticateCallback) {					

				var userId = jsonUtils.getPath(requestParams, 'uId');					
				userService.getUserById(userId, function(err,resultSet) {
					console.log("inauth >>>")
					if(err){
						authenticateCallback(err, null);
					} else{
						res.payload.status = "SUCCESS";
						res.payload.responseCode = "200";
						if(resultSet){
							res.payload.responseBody.userDetails = {};
							res.payload.responseBody.userDetails['id'] = resultSet.userid;
							res.payload.responseBody.userDetails['fName'] = resultSet.first_name;
							res.payload.responseBody.userDetails['lName'] = resultSet.last_name;
							res.payload.responseBody.userDetails['contact'] = resultSet.contactno;
							res.payload.responseBody.userDetails['dob'] = resultSet.birth_date;
							res.payload.responseBody.userDetails['flatno'] = resultSet.flatno;
							res.payload.responseBody.userDetails['email'] = resultSet.email;
						}
						
						authenticateCallback(null, res);	
					}
				});
			}
			
		], function (error, resp) {
			
			// Construct success response object and send back to the client.
			if(error){
				res.payload['responseCode'] = '400';
				res.payload.responseBody['message'] = 'User Details fetching Failed';
				res['status'] = "ERROR";
				response.send(res);
			} else {
				response.send(resp);
			}
			
		});
	}catch(error) {

		res.payload['responseCode'] = '400';
		res.payload.responseBody['message'] = 'User Details Failed';
		res['status'] = "ERROR";
		response.send(res);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

fetchUserByBuilding
/*
* Function to fetch user for specific building.
*
*/
function fetchUserByBuilding(requestParam, response) {
	var METHOD_NAME = 'fetchUserDetail(): ';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	var res = {
		payload: {
    		responseType: "application/json",
    		responseCode: "200",
   		    responseBody: {
       			 
   			 }
			 }
	};

	try {			
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = requestParam.body.payload;					
				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateAuthenticationRequest(payload);					

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					res.payload.status = "ERROR";
					res.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	res.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	resp.send(res);
				}

				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},
			// Function to authenticate users. 
			function fetchUserByBuilding(requestParams, fetchCallback) {					

				var bId = jsonUtils.getPath(requestParams, 'bId');					
				userService.getUserBybuilding(bId, function(err,resultSet) {
					console.log("inauth >>>")
					if(err){
						authenticateCallback(err, null);
					} else{
						res.payload.status = "SUCCESS";
						res.payload.responseCode = "200";
						res.payload.responseBody.userDetails = resultSet;
						fetchCallback(null, res);	
					}
				});
			}
			
		], function (error, resp) {
			
			// Construct success response object and send back to the client.
			if(error){
				res.payload['responseCode'] = '400';
				res.payload.responseBody['message'] = 'User Details fetching Failed';
				res['status'] = "ERROR";
				response.send(res);
			} else {
				response.send(resp);
			}
			
		});
	}catch(error) {

		res.payload['responseCode'] = '400';
		res.payload.responseBody['message'] = 'User Details Failed';
		res['status'] = "ERROR";
		response.send(res);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/*
* Function to update user details.
*
*/
function updateDetail(requestParam, response) {
	var METHOD_NAME = 'updateDetail(): ';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	var res = {
		payload: {
    		responseType: "application/json",
    		responseCode: "200",
   		    responseBody: {
       			 
   			 }
			 }
	};

	try {			
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = requestParam.body.payload;					
				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateAuthenticationRequest(payload);					

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					res.payload.status = "ERROR";
					res.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	res.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	resp.send(res);
				}

				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},
			//To update user Info.
			function updateUserDetail(requestParam, updateCallback) {
				var query = {
					"first_name": requestParam.fName,
					"last_name" : requestParam.lName,
					"email": requestParam.email,
					"contactno": requestParam.contact,
					"birth_date": requestParam.dob,
					"flatno": requestParam.flatno,
					"building_id" : requestParam.building_id
				};
				userService.updateUser(requestParam.id, query, function(error, resp){
					if(error) {
						updateCallback(error, null);	
					}
					updateCallback(null, requestParam.id);		
				});
			},
			// Function to authenticate users. 
			function getUserDetail(userId, authenticateCallback) {										
				userService.getUserById(userId, function(err,resultSet) {
					if(err){
						authenticateCallback(err, null);
					} else{
						res.payload.status = "SUCCESS";
						res.payload.responseCode = "200";
						res.payload.responseBody.userDetails = {};
						res.payload.responseBody.userDetails['id'] = resultSet.userid;
						res.payload.responseBody.userDetails['fName'] = resultSet.first_name;
						res.payload.responseBody.userDetails['lName'] = resultSet.last_name;
						res.payload.responseBody.userDetails['contact'] = resultSet.contactno;
						res.payload.responseBody.userDetails['dob'] = resultSet.birth_date;
						res.payload.responseBody.userDetails['flatno'] = resultSet.flatno;
						res.payload.responseBody.userDetails['email'] = resultSet.email;
						authenticateCallback(null, res);	
					}
				});
			}
			
		], function (error, resp) {
			
			// Construct success response object and send back to the client.
			if(error){
				res.payload['responseCode'] = '400';
				res.payload.responseBody['message'] = 'User Details Updation Failed';
				res['status'] = "ERROR";
				response.send(res);
			} else {
				response.send(resp);
			}
			
		});
	}catch(error) {

		res.payload['responseCode'] = '400';
		res.payload.responseBody['message'] = 'User Details updation error';
		res['status'] = "ERROR";
		response.send(res);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/*
* Function to add Building details.
*
*/
function addBuild(request, response) {
	var METHOD_NAME = "addBuild()";
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	logger.debug("================= Add Build =================");
	var finalResponse = responseUtils.constructResponseJson();

	try {
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = request.body.payload;					

				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateSignUpRequest(payload);

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					finalResponse.payload.status = "ERROR";
					finalResponse.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	finalResponse.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	response.send(finalResponse);
				}

				payload['protocol'] = request.protocol;
				payload['host'] = request.get('host');
				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},

			function registerBuildingDetails(requestParams, registrationCallback) {
				// Initializing variables from request body and setting default values.
				var document = {
					name: requestParams.bName,
					developer : requestParams.dName,
					active: requestParams.active
				}

				//here passing document to compare it with specified schema in db.js file
				var building ;
				try {
					building = model.building(document);
					userService.saveBuildingDetail(building, function (err, data) {
						if(err) {
							finalResponse.payload.status = "WARNING";
							finalResponse.payload.responseCode = err.code;
					    	finalResponse.payload.responseBody.message = err.message;					    	
						}
						else {							
							finalResponse.payload.status = "SUCCESS";
							finalResponse.payload.responseCode = constants.RESPONSE_SUCCESS;
					    	finalResponse.payload.responseBody['message'] = "Building Details added successfully.";	
					 	}
						logger.debug(JSON.stringify(finalResponse));
						registrationCallback(null, finalResponse);
					});
				}
				catch(error) {
					logger.error("Building data not inserted" + error);
					registrationCallback(error,null);
				}	
			}
		], function (error, finalResponse) {
			response.send(finalResponse);		
		});
	} catch(error) {
		finalResponse.payload['responseCode'] = '400';
		finalResponse.payload.responseBody['message'] = 'Building Registration Failed.';
		finalResponse['status'] = "ERROR";

		response.send(finalResponse);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/*
* Function to update building details.
*
*/
function updateBuildingDetail(requestParam, response) {
	var METHOD_NAME = 'updateBuildingDetail(): ';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	var res = {
		payload: {
    		responseType: "application/json",
    		responseCode: "200",
   		    responseBody: {
       			 
   			 }
			 }
	};

	try {			
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = requestParam.body.payload;					
				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateAuthenticationRequest(payload);					

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					res.payload.status = "ERROR";
					res.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	res.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	resp.send(res);
				}

				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},
			//To update user Info.
			function updateBuildingDetail(requestParam, updateCallback) {
				var query = {
					"name": requestParam.bName,
					"developer" : requestParam.dName,
					"active": requestParam.active
				};
				userService.updateBuilding(requestParam.id, query, function(error, resp){
					if(error) {
						updateCallback(error, null);	
					}
					updateCallback(null, requestParam.id);		
				});
			},
			// Function to get building details. 
			function getBuildingsDetail(userId, authenticateCallback) {										
				userService.getAllBulidings(function(err,resultSet) {
					if(err){
						authenticateCallback(err, null);
					} else{
						res.payload.status = "SUCCESS";
						res.payload.responseCode = "200";
						res.payload.responseBody.data = resultSet;
						authenticateCallback(null, res);	
					}
				});
			}
			
		], function (error, resp) {
			
			// Construct success response object and send back to the client.
			if(error){
				res.payload['responseCode'] = '400';
				res.payload.responseBody['message'] = 'Building Details Updation Failed';
				res['status'] = "ERROR";
				response.send(res);
			} else {
				response.send(resp);
			}
			
		});
	}catch(error) {

		res.payload['responseCode'] = '400';
		res.payload.responseBody['message'] = 'Building Details updation error';
		res['status'] = "ERROR";
		response.send(res);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/*
* Function to fetch all buildings details.
*
*/
function fetchAllBuild(requestParam, response) {
	var METHOD_NAME = 'fetchAllBuild(): ';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	var res = {
		payload: {
    		responseType: "application/json",
    		responseCode: "200",
   		    responseBody: {
       			 
   			 }
			 }
	};

	try {			
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = requestParam.body.payload;					
				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateAuthenticationRequest(payload);					

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					res.payload.status = "ERROR";
					res.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	res.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	resp.send(res);
				}

				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},
			// Function to get building details. 
			function getBuildingsDetail(req, authenticateCallback) {										
				userService.getAllBulidings(function(err,resultSet) {
					if(err){
						authenticateCallback(err, null);
					} else{
						res.payload.status = "SUCCESS";
						res.payload.responseCode = "200";
						res.payload.responseBody.data = resultSet;
						authenticateCallback(null, res);	
					}
				});
			}
			
		], function (error, resp) {
			
			// Construct response object and send back to the client.
			if(error){
				res.payload['responseCode'] = '400';
				res.payload.responseBody['message'] = 'Building Details fetching Failed';
				res['status'] = "ERROR";
				response.send(res);
			} else {
				response.send(resp);
			}
			
		});
	}catch(error) {

		res.payload['responseCode'] = '400';
		res.payload.responseBody['message'] = 'Building Details Failed';
		res['status'] = "ERROR";
		response.send(res);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/*
* Function to fetch Tax details for building.
*
*/
function fetchTemplate(requestParam, response) {
	var METHOD_NAME = 'fetchTemplate(): ';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	var res = {
		payload: {
    		responseType: "application/json",
    		responseCode: "200",
   		    responseBody: {
       			 
   			 }
			 }
	};

	try {			
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = requestParam.body.payload;					
				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateAuthenticationRequest(payload);					

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					res.payload.status = "ERROR";
					res.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	res.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	resp.send(res);
				}

				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},
			
			function getTaxDetail(req, authenticateCallback) {										
				userService.getTaxDetails(req.bId, function(err,resultSet) {
					if(err){
						authenticateCallback(err, null);
					} else{
						res.payload.status = "SUCCESS";
						res.payload.responseCode = "200";
						res.payload.responseBody.data = resultSet;
						authenticateCallback(null, res);	
					}
				});
			}
			
		], function (error, resp) {
			
			// Construct response object and send back to the client.
			if(error){
				res.payload['responseCode'] = '400';
				res.payload.responseBody['message'] = 'Tax Template Details fetching Failed';
				res['status'] = "ERROR";
				response.send(res);
			} else {
				response.send(resp);
			}
			
		});
	}catch(error) {

		res.payload['responseCode'] = '400';
		res.payload.responseBody['message'] = 'Tax Template Details Failed';
		res['status'] = "ERROR";
		response.send(res);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/*
* Function to update Tax Template details.
*
*/
function updateTemplate(requestParam, response) {
	var METHOD_NAME = 'updateTemplate(): ';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	var res = {
		payload: {
    		responseType: "application/json",
    		responseCode: "200",
   		    responseBody: {
       			 
   			 }
			 }
	};

	try {			
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = requestParam.body.payload;					
				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateAuthenticationRequest(payload);					

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					res.payload.status = "ERROR";
					res.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	res.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	resp.send(res);
				}

				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},
			//To update user Info.
			function updateTaxDetails(requestParam, updateCallback) {
				var query = {
					"template": requestParam.template
				};
				userService.updateTaxDetails(requestParam.bId, query, function(error, resp){
					if(error) {
						updateCallback(error, null);	
					}
					updateCallback(null, requestParam.bId);		
				});
			},
			// Function to get building details. 
			function getTaxDetail(bId, authenticateCallback) {										
				userService.getTaxDetails(bId, function(err,resultSet) {
					if(err){
						authenticateCallback(err, null);
					} else{
						res.payload.status = "SUCCESS";
						res.payload.responseCode = "200";
						res.payload.responseBody.data = resultSet;
						authenticateCallback(null, res);	
					}
				});
			}
			
		], function (error, resp) {
			
			// Construct success response object and send back to the client.
			if(error){
				res.payload['responseCode'] = '400';
				res.payload.responseBody['message'] = 'Tax Template Details Updation Failed';
				res['status'] = "ERROR";
				response.send(res);
			} else {
				response.send(resp);
			}
			
		});
	}catch(error) {

		res.payload['responseCode'] = '400';
		res.payload.responseBody['message'] = 'Tax Template Details updation error';
		res['status'] = "ERROR";
		response.send(res);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/*
* Function to add Tax Template details.
*
*/
function addTemplate(request, response) {
	var METHOD_NAME = "addTemplate()";
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	logger.debug("================= Add tax Template =================");
	var finalResponse = responseUtils.constructResponseJson();

	try {
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = request.body.payload;					

				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateSignUpRequest(payload);

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					finalResponse.payload.status = "ERROR";
					finalResponse.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	finalResponse.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	response.send(finalResponse);
				}

				payload['protocol'] = request.protocol;
				payload['host'] = request.get('host');
				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},

			function registerTaxDetails(requestParams, registrationCallback) {
				// Initializing variables from request body and setting default values.
				var document = {
					building_id: requestParams.bId,
					template: requestParams.template
				}

				//here passing document to compare it with specified schema in db.js file
				var taxTemplate ;
				try {
					taxTemplate = model.taxTemplate(document);
					userService.saveTaxDetail(taxTemplate, function (err, data) {
						if(err) {
							finalResponse.payload.status = "WARNING";
							finalResponse.payload.responseCode = err.code;
					    	finalResponse.payload.responseBody.message = err.message;					    	
						}
						else {							
							finalResponse.payload.status = "SUCCESS";
							finalResponse.payload.responseCode = constants.RESPONSE_SUCCESS;
					    	finalResponse.payload.responseBody['message'] = "Tax Template added successfully.";	
					 	}
						logger.debug(JSON.stringify(finalResponse));
						registrationCallback(null, finalResponse);
					});
				}
				catch(error) {
					logger.error("Tax Template data not inserted" + error);
					registrationCallback(error,null);
				}	
			}
		], function (error, finalResponse) {
			response.send(finalResponse);		
		});
	} catch(error) {
		finalResponse.payload['responseCode'] = '400';
		finalResponse.payload.responseBody['message'] = 'Tax Template Registration Failed.';
		finalResponse['status'] = "ERROR";

		response.send(finalResponse);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
}; 

/*
* Function to add Tax Invoices details.
*
*/
function addInvoices(request, response) {
	var METHOD_NAME = "addInvoices()";
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	logger.debug("================= Add tax Invoices =================");
	var finalResponse = responseUtils.constructResponseJson();

	try {
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = request.body.payload;					

				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateSignUpRequest(payload);

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					finalResponse.payload.status = "ERROR";
					finalResponse.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	finalResponse.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	response.send(finalResponse);
				}

				payload['protocol'] = request.protocol;
				payload['host'] = request.get('host');
				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},

			function addTaxInvoices(requestParams, registrationCallback) {
				// Initializing variables from request body and setting default values.
				var document = {
					building_id: requestParams.bId,
					month: requestParams.month,
					tax: requestParams.invoices
				}

				//here passing document to compare it with specified schema in db.js file
				var taxInvoice ;
				try {
					taxInvoice = model.taxInvoice(document);
					userService.saveTaxInvoices(taxInvoice, function (err, data) {
						if(err) {
							finalResponse.payload.status = "WARNING";
							finalResponse.payload.responseCode = err.code;
					    	finalResponse.payload.responseBody.message = err.message;					    	
						}
						else {							
							finalResponse.payload.status = "SUCCESS";
							finalResponse.payload.responseCode = constants.RESPONSE_SUCCESS;
					    	finalResponse.payload.responseBody['message'] = "Tax Invoices added successfully.";	
					 	}
						logger.debug(JSON.stringify(finalResponse));
						registrationCallback(null, finalResponse);
					});
				}
				catch(error) {
					logger.error("Tax Invoices data not inserted" + error);
					registrationCallback(error,null);
				}	
			}
		], function (error, finalResponse) {
			response.send(finalResponse);		
		});
	} catch(error) {
		finalResponse.payload['responseCode'] = '400';
		finalResponse.payload.responseBody['message'] = 'Tax Invoices Registration Failed.';
		finalResponse['status'] = "ERROR";

		response.send(finalResponse);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
}; 

/*
* Function to fetch Tax details for building.
*
*/
function fetchInviocesForBuilding(requestParam, response) {
	var METHOD_NAME = 'fetchInviocesForBuilding(): ';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	var res = {
		payload: {
    		responseType: "application/json",
    		responseCode: "200",
   		    responseBody: {
       			 
   			 }
			 }
	};

	try {			
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = requestParam.body.payload;					
				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateAuthenticationRequest(payload);					

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					res.payload.status = "ERROR";
					res.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	res.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	resp.send(res);
				}

				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},
			
			function getInviocesForBuilding(req, authenticateCallback) {										
				userService.getInviocesForMonth(req.bId, req.month, function(err,resultSet) {
					if(err){
						authenticateCallback(err, null);
					} else{
						res.payload.status = "SUCCESS";
						res.payload.responseCode = "200";
						res.payload.responseBody.data = resultSet;
						authenticateCallback(null, res);	
					}
				});
			}
			
		], function (error, resp) {
			
			// Construct response object and send back to the client.
			if(error){
				res.payload['responseCode'] = '400';
				res.payload.responseBody['message'] = 'Tax Details fetching Failed';
				res['status'] = "ERROR";
				response.send(res);
			} else {
				response.send(resp);
			}
			
		});
	}catch(error) {

		res.payload['responseCode'] = '400';
		res.payload.responseBody['message'] = 'Tax Details Failed';
		res['status'] = "ERROR";
		response.send(res);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

/*
* Function to fetch Tax details for User.
*
*/
function fetchInviocesForUser(requestParam, response) {
	var METHOD_NAME = 'fetchInviocesForUser(): ';
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<START>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
	var res = {
		payload: {
    		responseType: "application/json",
    		responseCode: "200",
   		    responseBody: {
       			 
   			}
		}
	};

	try {			
		async.waterfall([
			function validateRequestParameter(requestParametersCallback) {
				var payload = requestParam.body.payload;					
				// Validate request parameters.
				var requestValidationResponse = validationUtils.validateAuthenticationRequest(payload);					

				// If any value of required fields given in the validation function is not available then error message send back to the client. 
				if(!requestValidationResponse.status) {
					
					res.payload.status = "ERROR";
					res.payload.responseCode = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_CODE;
			    	res.payload.responseBody.message = appUtils.getErrorMessage("REQUEST_PARAMETERS_MISSING").ERROR_MESSAGE;
			    	resp.send(res);
				}

				// Pass request parameters to the next function.
				requestParametersCallback(null, payload);
			},
			
			function getInviocesForUser(req, authenticateCallback) {										
				userService.getInviocesByBuilding(req.bId, function(err,resultSet) {
					if(err){
						authenticateCallback(err, null);
					} else{
						var data = [];
						for(var i=0; i<resultSet.length; i++){
							for(var j=0;j<resultSet[i].tax.length; i++){
								if(resultSet[i].tax[j].userid == req.uId){
									data.push(resultSet[i].tax[j]);
								}
							}
						}
						res.payload.status = "SUCCESS";
						res.payload.responseCode = "200";
						res.payload.responseBody.data = data;
						authenticateCallback(null, res);	
					}
				});
			}
			
		], function (error, resp) {
			
			// Construct response object and send back to the client.
			if(error){
				res.payload['responseCode'] = '400';
				res.payload.responseBody['message'] = 'Tax Details fetching Failed';
				res['status'] = "ERROR";
				response.send(res);
			} else {
				response.send(resp);
			}
			
		});
	}catch(error) {

		res.payload['responseCode'] = '400';
		res.payload.responseBody['message'] = 'Tax Details Failed';
		res['status'] = "ERROR";
		response.send(res);
	}
	logger.info('<<<<<<<<<<<<<<' + CONTROLLER_NAME +"<<<<END>>>>"+ METHOD_NAME + '>>>>>>>>>>>>>>>>>>>>>>>');
};

// Page will display after payment has beed transfered successfully
router.get('/success', function(req, res) {
  res.send("Payment transfered successfully.");
});
 
// Page will display when you canceled the transaction 
router.get('/cancel', function(req, res) {
  res.send("Payment canceled successfully.");
});

router.post('/paynow', function(req, res) {
   // paypal payment configuration.
  	var payment = {
	  "intent": "sale",
	  "payer": {
	    "payment_method": "paypal"
	  },
	  "redirect_urls": {
	    "return_url": app.locals.baseurl+"/success",
	    "cancel_url": app.locals.baseurl+"/cancel"
	  },
	  "transactions": [{
	    "amount": {
	      "total":parseInt(req.body.amount),
	      "currency":  req.body.currency
	    },
	    "description": req.body.description
	  }]
	};
 
	  paypal.payment.create(payment, function (error, payment) {
	  if (error) {
	    console.log(error);
	  } else {
	    if(payment.payer.payment_method === 'paypal') {
	      req.paymentId = payment.id;
	      var redirectUrl;
	      console.log(payment);
	      for(var i=0; i < payment.links.length; i++) {
	        var link = payment.links[i];
	        if (link.method === 'REDIRECT') {
	          redirectUrl = link.href;
	        }
	      }
	      res.redirect(redirectUrl);
	    }
	  }
	});
});
module.exports = router;