/**
* Purpose- Defining routes and logic
* Author- Nikhil Patil
*/
var express = require('express');
var router = express.Router();
var responseUtils = require('../utils/responseUtils.js');
var validationUtils = require('../utils/validationUtils.js');
var jsonUtils = require('../utils/jsonUtils.js');
var userService = require('../dao/userService.js');
var constants = require('../utils/constants.js');
var async = require('async');


router.post('/login', authentication);
router.post('/createuser', createuser);


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
	userDao.logout(requestParams.body.header.sessionId, function(error, resp) {

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

module.exports = router;