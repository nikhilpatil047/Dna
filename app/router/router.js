/**
* Purpose- Defining routes and logic
* Author- Nikhil Patil
*/
var express = require('express');
var router = express.Router();
var responseUtils = require('../utils/responseUtils.js');
var validationUtils = require('../utils/validationUtils.js');
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

				var email = jsonUtils.getPath(requestParams, 'userEmail');
				var password = jsonUtils.getPath(requestParams, 'password');					

				userSession.userLogin(requestParam, function(respo) {
					// Check if user is logged in for the first time.						
					if(respo.payload.responseBody.userDetails && respo.payload.responseBody.userDetails.isFirstLogin) {							
						
						// Create self group.
						
						var	payload =  {
							groupName : respo.payload.responseBody.userDetails.firstName + " " + respo.payload.responseBody.userDetails.lastName,
							groupPhoto : null,
							createdBy : respo.payload.responseBody.userDetails.userId,//respo.payload.responseBody.userDetails.firstName + " " + respo.payload.responseBody.userDetails.lastName,
							updatedBy : respo.payload.responseBody.userDetails.userId,//respo.payload.responseBody.userDetails.firstName + " " + respo.payload.responseBody.userDetails.lastName,
							self_group : true,
							groupDescription : null,
							groupMembers : [],
							deleted : false ,
							last_updated_date : appUtils.currentDate() ,
							created_date : appUtils.currentDate()
						};
						payload['protocol'] = requestParam.protocol;
						payload['host'] = requestParam.get('host');
						var selfGroupDocument = {"body": {"payload" :payload}};
						groupService.createGroupService(selfGroupDocument,function(error, result) {
							if(result) {
								// Reset the isFirstLogin flag to false.
								userDao.updateUser(respo.payload.responseBody.userDetails.userId, {"is_first_login" : false}, function(error, rep)  {
									authenticateCallback(null, respo);
								});
							}else {
								authenticateCallback(null, respo);
							}
						});
					}else {
						authenticateCallback(null, respo);
					}						
				});
			}
			
		], function (error, response) {

			// Construct success response object and send back to the client.
			if(response.payload.responseCode != '200') {
				requestParam.session.destroy();
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

module.exports = router;