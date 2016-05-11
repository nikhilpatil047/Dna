/**
* Purpose- For sending email verification using sendgrid.
* Author- Akash jain
*/

var emailConfig = require("../config/emailer-config.json");
var path = require("path");
var sendgrid  = require('sendgrid')(emailConfig.credentials['username'],emailConfig.credentials['password']);
var Hogan = require('hogan.js');
var fs = require('fs');
var filePath = path.join(__dirname,'../lib/');
var template = fs.readFileSync(filePath+'/email.hjs','utf-8',function(err,data){
	logger.error(err);
});
var compiledTemplate = Hogan.compile(template);


function emailer (to, firstName, lastName, verificationLink ,message,buttonText) {

	var email = new sendgrid.Email({
		to : to,
		from : emailConfig.parameters['from'],
		subject : emailConfig.parameters['subject'],
		html : compiledTemplate.render({firstName : firstName + " "+ lastName, verificationLink : verificationLink , message : message, buttonText : buttonText})
	});

	sendgrid.send(email, function(err, json) {
		if (err) { 
	 		return logger.error("Error in sending email through sendgrid"+err);
	 	}
	 	logger.debug("Email has been sent successfully"+json);
	});

}

function signupEmailer (to, firstName, lastName, verificationLink ,message1,message2,message3,message4,buttonText,subject) {

	var email = new sendgrid.Email({
		to : to,
		from : emailConfig.parameters['from'],
		subject : subject,
		html : compiledTemplate.render({firstName : firstName + " "+ lastName, verificationLink : verificationLink , message1 : message1,message2 : message2,message3:message3,message4:message4,buttonText : buttonText})
	});

	sendgrid.send(email, function(err, json) {
		if (err) { 
	 		return logger.error("Error in sending email through sendgrid"+err);
	 	}
	 	logger.debug("Email has been sent successfully"+json);
	});

}

function emailSender(to, firstName, lastName, verificationLink ,message1_1,message1_2,message1_3,message1_4,message1_5,message2,message3,message4,buttonText,subject) {

	var email = new sendgrid.Email({
		to : to,
		from : emailConfig.parameters['from'],
		subject : subject,
		html : compiledTemplate.render({firstName : firstName + " "+ lastName, verificationLink : verificationLink , message1_1 : message1_1, message1_2 : message1_2, message1_3 : message1_3, message1_4 : message1_4, message1_5 : message1_5,message2 : message2,message3:message3,message4:message4,buttonText : buttonText})
	});

	sendgrid.send(email, function(err, json) {
		if (err) { 
	 		return logger.error("Error in sending email through sendgrid"+err);
	 	}
	 	logger.debug("Email has been sent successfully"+json);
	});

}


module.exports.emailer = emailer;
module.exports.signupEmailer = signupEmailer;
module.exports.emailSender = emailSender;