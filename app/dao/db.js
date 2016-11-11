/**
* Purpose- Defining shcemas
* Author- Nikhil Patil
*/

var mongoose = require('mongoose');
var config = require('../config/config.js').options();

var mongoOptions = config.mongoConnectOptions;
var dbServerArrayJson = config.dbServerArray;

mongoose.connect(dbServerArrayJson.join(), mongoOptions);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
	logger.info('Connection to Mongo Successful');

});

var Schema = mongoose.Schema;

global.ObjectId = mongoose.Types.ObjectId; 

/** defining schema for User collection 
*/
var userSchema = Schema ({

	username: { type : String, required : true, unique : true },
	password: String, // encrypted value will be stored
	profile_photo: String, // We can store the path or base64 for the image.
	building_name: String,
	building_id: String,
	user_type: String,
	address: String,
	security_question: {},
	notificationTypes : { // for now we kept this but if we make it as feature level notification.
		forgotPassword : Boolean
	},
	created_date : Date
});

var userDetailSchema = Schema ({
	userid: String,
	first_name: String,
	last_name : String,
	email: String,
	contactno: String,
	birth_date: Date,
	flatno: String
});

var buildingSchema = Schema ({
	id: String,
	name: String,
	developer : String,
	active: Boolean
});

var taxInvoiceSchema = Schema ({ 
	building_id : String,
	month: String,
	tax: []
});

var taxTemplateSchema = Schema ({ 
	building_id : String,
	template: {}
});

var sessionSchema = Schema ({
	// session : {
	// 	sessionId: { type: String, required : true, unique : true },
	// 	username: String
	// }
});

module.exports.mongoConnection = db;
module.exports.Users = mongoose.model('Users',userSchema,'user');
module.exports.userDetail = mongoose.model('userDetail',userDetailSchema,'userdetail');
module.exports.building = mongoose.model('building',buildingSchema,'building');
module.exports.taxTemplate = mongoose.model('taxTemplate',taxTemplateSchema,'taxtemplate');
module.exports.taxInvoiceSchema = mongoose.model('taxInvoice',taxInvoiceSchema,'taxinvoice');
module.exports.Session = mongoose.model('Session',sessionSchema,'session');
