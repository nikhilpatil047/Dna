
var model = require('./db.js');
var appUtils = require('../utils/appUtils.js');


function validSession( sessionId ,callback) {

	// If session id is of string data type, convert it to JSON.
	// if(typeof(sessionId) === "string")
	//	sessionId = JSON.parse(sessionId);
	logger.debug("sessionId"+sessionId + " : " + typeof(sessionId));
	// Fetch Session object to see if session exist / not.
	model.Session.findOne({"session.sessionId" : sessionId  }, function(err,result) {		
		logger.debug(JSON.stringify(result));
		// If error in fetching object
		if (err) {
			var errorMessage = {
				"code" : appUtils.getErrorMessage("ERROR_IN_DATABASE_OPERATION").ERROR_CODE,
				"message" : appUtils.getErrorMessage("ERROR_IN_DATABASE_OPERATION").ERROR_MESSAGE
			}
			callback(errorMessage, null);
		} 
		// Return response based on session available / not.
		if(result) {
			callback(null, true);
		} else {
			var errorMessage = {
				"code" : appUtils.getErrorMessage("SESSION_EXPIRED").ERROR_CODE,
				"message" : appUtils.getErrorMessage("SESSION_EXPIRED").ERROR_MESSAGE
			}
			callback(errorMessage,null);
		}
	});		
};

function destroySession(sessionId, callback) {
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
};

module.exports.validSession= validSession;
module.exports.destroySession = destroySession;	




