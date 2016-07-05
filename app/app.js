/**
* Purpose - Entry point for nodejs application 
* Author - Nikhil Patil
*/
/* jshint node: true */
'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config/config.js');
var router = require('./router/router.js');


//For logger file
var Logger = require('./utils/logger.js').Logger;

var session = require('express-session');



//var mongoStore = require('express-session-mongo');
var MongoStore = require('connect-mongo')(session);

var model = require('./dao/db.js');

//@function Logger(category,level);
global.logger = new Logger('console', config.loglevel());
//Creating required directories.
// config.creatingDirectory();
var app = express();
//Allow Cross Domain Access
var allowCrossDomain = function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');

      next();
};
app.use(allowCrossDomain);

// Session middleware
app.use(session({
      cookie: { maxAge: 15 * 24 * 60 * 60 * 1000, path : '/login'} ,
      secret: "Dna" ,
      saveUninitialized: false,
     resave: false,
      store:new MongoStore({
               //url:config.dbConnectionString, 
               db:'Dna',
               mongooseConnection : model.mongoConnection, 
               collection : 'session', 
               autoReconnect : true,
              //host: config.db.host,
              //port:27019,// config.db.port, 
              /*username: 'cm',
              password: 'cm', */
              stringify:false,
              autoRemove: 'enabled',
              touchAfter: 15 * 24 * 60 * 60 * 1000
      })
  },function(err){
    console.log(err || 'connect-mongodb setup ok');
  }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

app.use('/', router);

// Load AngularUI
app.use(express.static(__dirname + '/web'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/serverResources'));

app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  logger.info('Express server listening on port ' + server.address().port);
});

