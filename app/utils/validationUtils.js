'use strict';
// Dependencies.
var utils = require('./appUtils.js');
var jsonUtils = require('./jsonUtils.js');
// var constants = require('../config/constants.js');

var Validation = function() {
	/// Global module level variables.
	var MODULE_NAME = 'Validation: ';

	this.validateAuthenticationRequest = validateAuthenticationRequest;
	this.validateSignUpRequest = validateSignUpRequest;
	this.validateResendRequest = validateResendRequest;

	/**
	 * Validate key hierarchy exists in Json Object and its value is not blank.
	 * @returns boolean - Contains a boolean indicating success/failure & error message, if any.
	 */
	function validatePathAndData(jsonObject, keyHierarchy, response, message) {
		var METHOD_NAME = 'validatePathAndData(): ';
				
		if (!jsonUtils.isPath(jsonObject, keyHierarchy)) {
			response.status = false;
			response.message += message;
		}

		return response;
	};

	/**
	 * Validate request parameters for authentication request.
	 *
	 * @returns jsonObject
	 */
	function validateAuthenticationRequest(requestParams) {
		var METHOD_NAME = 'validateAuthenticationRequest(): ';
		
		// Generate response variable to be send.
		var response = {
			status: true,
			message: ""
		};

		// Request payload parameters exists?
		if(requestParams == null || requestParams == undefined) {
			response.status = false;
			response.message += 'Missing request payload.';

			return response;
		}

		// Is Email Id specified?
		validatePathAndData(requestParams, 'userEmail', response, 'Email Id not specified.');

		// Is Password specified?
		validatePathAndData(requestParams, 'password', response, 'Password not specified.');		

		return response;
	};

	/* Function to validate Sign up request parameters
	 * returns json object
	 */
	function validateSignUpRequest(requestParams) {
		var METHOD_NAME = 'validateAuthenticationRequest(): ';
		console.log("===================" + requestParams + "====================");
		
		// Generate response variable to be send.
		var response = {
			status: true,
			message: ""
		};

		// Request payload parameters exists?
		if(requestParams == null || requestParams == undefined) {
			response.status = false;
			response.message += 'Missing request payload.';

			return response;
		}

		// Is Email Id specified?
		validatePathAndData(requestParams, 'userEmail', response, 'Email Id not specified.');

		// Is First name specified?
		validatePathAndData(requestParams, 'firstName', response, 'First name not specified.');

		// Is Last name specified?
		validatePathAndData(requestParams, 'lastName', response, 'Last name not specified.');

		// Is NDA accepted?
		// validatePathAndData(requestParams, 'acceptance', response, 'NDA not accepted.');

		// Is Password specified?
		validatePathAndData(requestParams, 'password', response, 'Password not specified.');

		return response;
	};

	/* Function to validate resend link request parameters
	 * returns json object
	 */
	function validateResendRequest(requestParams) {
		var METHOD_NAME = 'validateResendRequest(): ';
		console.log("===================" + requestParams + "====================");

		var response = {
			status: true,
			message: ""
		};

		if(requestParams == null || requestParams == undefined) {
			response.status = false;
			response.message += 'Missing request payload.';

			return response;
		}

		// Is Email Id specified?
		validatePathAndData(requestParams, 'userEmail', response, 'Email Id not specified.');

		return response;
	}
};

// Exports module.
module.exports = new Validation();