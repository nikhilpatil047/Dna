/**
* Purpose- Defining loggers
* Author- Akash Jain
*/
/* jshint node: true */
"use strict";
var log4js = require("log4js");
var moment = require('moment');
var fs = require('fs');

/**
* To create log directory if it is not exists.
* @param {string} directory name
* @param  chmod directory permissions
*/
if(!fs.existsSync("./log")) {
    fs.mkdirSync("./log","0766", function(err) {
        if(err) {
        logger.error("Can't make Log directory"+err);
        }
    })
};

/**
* To attach current date with log file name.
*  here moment module is used for date format.
*/
var now = moment(new Date());
var dateString = now.format('YYYY-MM-DD');
var filename = './log/log-'+dateString+'.log';

/**
* Here we passing logger's settings in configure function.
* In array first object is for file type and second object is
* for console type loggers.
*/
log4js.configure({
	appenders :[ 
	 {
        "category": "file", 
        "filename":filename,
        "type": "file",
        "maxLogSize": 10240,
        "backups": 10,
        "layout": {
            "type": "pattern",
            "pattern": "%d{yyyy-MM-dd hh:mm:ss.SSS} [%-5p] [%c] - %m"
        }
     },
     {
        "type": "console",
        "layout": {
            "type": "pattern",
            "pattern": "%m"
        },
        "category": "console"
     }
    ]
});

/**
* here we using log4js inbuilt functions.
* @function getLogger() 
* @function setLevel()
*/

exports.logger = {
    getLogger : function(category,level) {
        var theLogger = log4js.getLogger(category);
        var level = level.toUpperCase();
        theLogger.setLevel(level);
        return theLogger;
    }
};

/**
* For setting logger category and level as required.
* @param {string} category 
* @param {string} level
*/

var Logger = function Logger(category,level) {

    this.theLogger = exports.logger.getLogger(category,level);
}

/** 
* defining customized logger functions.
*/

Logger.prototype.trace = function trace(msg){
    logIt(this.theLogger, "trace", msg);
};

Logger.prototype.debug = function debug(msg){
    logIt(this.theLogger, "debug", msg);
};

Logger.prototype.info = function info(msg){
    logIt(this.theLogger, "info", msg);
};

Logger.prototype.error = function error(msg){
   logIt(this.theLogger, "error", msg);
};

Logger.prototype.warn = function warn(msg){
    logIt(this.theLogger, "warn", msg);
};

Logger.prototype.fatal = function fatal(msg){
    logIt(this.theLogger, "fatal", msg);
};

/** 
* @constructor
* @param  {object} theLogger 
* @param {string} theLevel
* @param {string} theMsg
*/

function logIt(theLogger, theLevel, theMsg) {

    theLogger[theLevel]("%s", theMsg);  
}

module.exports.Logger = Logger;

