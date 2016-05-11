/**
* @file: utils/apputils.js
* @desc: class has some commong utillity function required for application.
* @author: Prashant Joshi | Mindstix Labs
*/
var uuid = require('node-uuid');
var  errMsg = require('./error_message.json');
var moment = require('moment');
var sessionDAO = require('../dao/session-dao.js');
var multer  = require('multer');
var path = require('path');
var fs = require('fs');
//var mkdirp = require("mkdirp")
var constants = require('../utils/constants.js');
exports.getErrorMessage =  getErrorMessage ;

// UUID generation
function generateToken(){
	return uuid.v4();
}


function getErrorMessage(ERROR_CODE) {
	return errMsg['error_messages'][ERROR_CODE];
}

/**
   * Is specified string reference null or empty?
   * 
   * @param field
   * @return Boolean
   */
function isBlank(field) {
	//console.log('------------------------ isBlank ---------------------------');
	if (field === null || field === undefined) {
	  return true;
	}

	if (typeof field !== 'string') {
	  return false;
	}

	if (field.trim().length === 0) {
	  return true;
	}

	return false;
}

function currentDate() {
	var date = new Date();
	// var now = moment(date);
	// var date = now.format('DD-YY-YYYY');
	return date;
}


function sessionValidation(sessionId,callback) {

	sessionDAO.validSession(sessionId,function(err,result) {
		if(err) {
	  		return callback(err,null);
		} else {
	  		return callback(null,result);
		}
	});

}

function documentStorage() {
	uploadPath =  path.join(__dirname, '../uploads/'+ constants.ORGANIZATION_ID.MINDSTIX);
	return uploading = multer({ 
		dest: uploadPath,
		rename : function (fieldname, filename,req,res) {
			if(req.body.groupId && req.body.projectId) {
				return generateToken();
			}else if(req.body.groupId) {
				return req.body.groupId;
			}else if(req.body.userId) {
				return generateToken();//return req.body.userId;
			}else {
				return generateToken();
			} 	 
		},
		changeDest : function(dest, req, res) {
			if(req.body.groupId ) {
				//groupId
				var groupDestination = dest +'/group-'+ req.body.groupId;
				var stat = null;
				try {
					stat = fs.statSync(groupDestination);
					if(req.body.projectId) {
						var projectDestination = groupDestination +'/project-'+ req.body.projectId;
						try {
						 	stat = fs.statSync(projectDestination);
						 	if(req.body.entryId) {
						 		//entry Id
						 		var entryDestination = projectDestination +'/entry-'+ req.body.entryId;
								try {
								 	stat = fs.statSync(entryDestination);
								 	if(req.body.actionId) {
								 		var actionDestination = entryDestination +'/action-'+ req.body.actionId;
								 		try {
								 			stat = fs.statSync(actionDestination);
								 			return actionDestination;	
								 		}catch(err) {
								 			fs.mkdirSync(actionDestination,function(err) {
												if(err) {
													throw new Error("Error:"+err.message);
											 	}
											});
											return actionDestination;
								 		}	
								 	}else {
								 		return entryDestination;
								 	}
								}catch (err) {
						 			fs.mkdirSync(entryDestination,function(err) {
										if(err) {
											throw new Error("Error:"+err.message);
									 	}
									});
									if(req.body.actionId) {
								 		var actionDestination = entryDestination +'/action-'+ req.body.actionId;
								 		try {
								 			stat = fs.statSync(actionDestination);
								 			return actionDestination;	
								 		}catch(err) {
								 			fs.mkdirSync(actionDestination,function(err) {
												if(err) {
													throw new Error("Error:"+err.message);
											 	}
											});
											return actionDestination;
								 		}	
								 	}else {
								 		return entryDestination;
								 	}
					 			}
					 		}else if(req.body.actionId) {
								var actionDestination = projectDestination +'/action-'+ req.body.actionId;
								try {
									stat = fs.statSync(actionDestination);
								 	return actionDestination;	
								}catch(err) {
								 	fs.mkdirSync(actionDestination,function(err) {
										if(err) {
												throw new Error("Error:"+err.message);
										}
									});
									return actionDestination;
								}	
							}else {
					 			return projectDestination;
					 		}
						 	//return newDestination;
						}catch (err) {
						 	fs.mkdirSync(projectDestination,function(err) {
						 		if(err) {
						 			throw new Error("Error:"+err.message);
						 		}	
							});
							if(req.body.entryId) {
							 	//entry Id
							 	var entryDestination = projectDestination +'/entry-'+ req.body.entryId;
								try {
								 	stat = fs.statSync(entryDestination);
								 	if(req.body.actionId) {
								 		var actionDestination = entryDestination +'/action-'+ req.body.actionId;
								 		try {
								 			stat = fs.statSync(actionDestination);
								 			return actionDestination;	
								 		}catch(err) {
								 			fs.mkdirSync(actionDestination,function(err) {
												if(err) {
													throw new Error("Error:"+err.message);
											 	}
											});
											return actionDestination;
								 		}	
								 	}else {
								 		return entryDestination;
								 	}
								 	//return entryDestination;
								}catch (err) {
						 			fs.mkdirSync(entryDestination,function(err) {
										if(err) {
											throw new Error("Error:"+err.message);
									 	}
									});
									if(req.body.actionId) {
								 		var actionDestination = entryDestination +'/action-'+ req.body.actionId;
								 		try {
								 			stat = fs.statSync(actionDestination);
								 			return actionDestination;	
								 		}catch(err) {
								 			fs.mkdirSync(actionDestination,function(err) {
												if(err) {
													throw new Error("Error:"+err.message);
											 	}
											});
											return actionDestination;
								 		}	
								 	}else {
								 		return entryDestination;
								 	}
									//return entryDestination;
					 			}
					 		}else if(req.body.actionId) {
								var actionDestination = projectDestination +'/action-'+ req.body.actionId;
								try {
									stat = fs.statSync(actionDestination);
								 	return actionDestination;	
								}catch(err) {
								 	fs.mkdirSync(actionDestination,function(err) {
										if(err) {
												throw new Error("Error:"+err.message);
										}
									});
									return actionDestination;
								}	
							}else {
					 			return projectDestination;
					 		}
						}	 	
					}else {
						var profileDestination = groupDestination +'/profile';
						try {
						 	stat = fs.statSync(profileDestination);
						 	return profileDestination;
						}catch (err) {
						 	fs.mkdirSync(profileDestination,function(err) {
							 	if(err) {
									throw new Error("Error:"+err.message);
							 	}
							});	
							return profileDestination;
						}
					}	
				}catch (err) {
					fs.mkdirSync(groupDestination,function(err) {
						if(err) {
							throw new Error("Error:"+err.message);
						}
					});	
					if(req.body.projectId) {
							var projectDestination = groupDestination +'/project-'+ req.body.projectId;
							try {
						 		stat = fs.statSync(projectDestination);
						 		//entry Id
						 		if(req.body.entryId) {
						 			//entry Id
						 			var entryDestination = projectDestination +'/entry-'+ req.body.entryId;
									try {
									 	stat = fs.statSync(entryDestination);
									 	if(req.body.actionId) {
									 		var actionDestination = entryDestination +'/action-'+ req.body.actionId;
									 		try {
									 			stat = fs.statSync(actionDestination);
									 			return actionDestination;	
									 		}catch(err) {
									 			fs.mkdirSync(actionDestination,function(err) {
													if(err) {
														throw new Error("Error:"+err.message);
												 	}
												});
												return actionDestination;
									 		}	
									 	}else {
									 		return entryDestination;
									 	}
									 	//return entryDestination;
									}catch (err) {
							 			fs.mkdirSync(entryDestination,function(err) {
											if(err) {
												throw new Error("Error:"+err.message);
										 	}
										 	return entryDestination;
										});	
						 			}
					 			}else if(req.body.actionId) {
									var actionDestination = projectDestination +'/action-'+ req.body.actionId;
									try {
										stat = fs.statSync(actionDestination);
									 	return actionDestination;	
									}catch(err) {
									 	fs.mkdirSync(actionDestination,function(err) {
											if(err) {
													throw new Error("Error:"+err.message);
											}
										});
										return actionDestination;
									}	
								}else {
					 				return projectDestination;
					 			}		
							}catch (err) {
						 		fs.mkdirSync(projectDestination,function(err) {
						 			if(err) {
						 				throw new Error("Error:"+err.message);
						 			}	
								});
								if(req.body.entryId) {
								 	//entry Id
								 	var entryDestination = projectDestination +'/entry-'+ req.body.entryId;
									try {
									 	stat = fs.statSync(entryDestination);
									 	return entryDestination;
									}catch (err) {
							 			fs.mkdirSync(entryDestination,function(err) {
											if(err) {
												throw new Error("Error:"+err.message);
										 	}
										});
										if(req.body.actionId) {
									 		var actionDestination = entryDestination +'/action-'+ req.body.actionId;
									 		try {
									 			stat = fs.statSync(actionDestination);
									 			return actionDestination;	
									 		}catch(err) {
									 			fs.mkdirSync(actionDestination,function(err) {
													if(err) {
														throw new Error("Error:"+err.message);
												 	}
												});
												return actionDestination;
									 		}	
									 	}else {
									 		return entryDestination;
									 	}	
										//return entryDestination;
						 			}
						 		}else if(req.body.actionId) {
									var actionDestination = projectDestination +'/action-'+ req.body.actionId;
									try {
										stat = fs.statSync(actionDestination);
									 	return actionDestination;	
									}catch(err) {
									 	fs.mkdirSync(actionDestination,function(err) {
											if(err) {
													throw new Error("Error:"+err.message);
											}
										});
										return actionDestination;
									}	
								}else {
					 				return projectDestination;
					 			}
							}	 	
					}else {
						var profileDestination = groupDestination +'/profile';
						try {
						 	stat = fs.statSync(profileDestination);
						 	return profileDestination;
						}catch (err) {
						 	fs.mkdirSync(profileDestination,function(err) {
							 	if(err) {
									throw new Error("Error:"+err.message);
							 	}
							});
							return profileDestination;
						}
					}
				}
			}else if(req.body.actionId) {
				var actionDestination = dest +'/action-'+ req.body.actionId;
				var stat = null;
				try {
					stat = fs.statSync(actionDestination);
					return actionDestination;
				}catch (err) {
					fs.mkdirSync(actionDestination,function(err) {
						if(err) {
							throw new Error("Error:"+err.message);
					 	}
					});	
					return actionDestination;
				}
			}else {
				var newDestination = dest +'/userprofile'
				var stat = null;
				try {
					stat = fs.statSync(newDestination);
					return newDestination;
				}catch (err) {
					fs.mkdirSync(newDestination,function(err) {
						if(err) {
							throw new Error("Error:"+err.message);
					 	}
					});	
					return newDestination;
				}
			}
			if (stat && !stat.isDirectory()) {
				throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
			}		
		}
	});
}

function uploadProfilePhoto() {
	uploadPath =  path.join(__dirname, '../uploads/'+ constants.ORGANIZATION_ID.MINDSTIX);
	return uploading = multer({ 
		limits : {  maxFileSize : 100},//1mb
		onFilesLimit: function () {
		  console.log('Crossed file limit!')
		},
		dest: uploadPath,
		rename : function (fieldname, filename,req,res) {
			if(req.body.userId) {
				return generateToken();
			}	 
		},
		changeDest : function(dest, req, res) {
			var newDestination = dest +'/userprofile' ;
			var stat = null;
			try {
				stat = fs.statSync(newDestination);
				return newDestination;
			}catch (err) {
				fs.mkdirSync(newDestination,function(err) {
					if(err) {
						throw new Error("Error:"+err.message);
					 }
				});	
				return newDestination;
			}
			if (stat && !stat.isDirectory()) {
				throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
			}		
		}
		
	});
}
function parseCookies(cookie) {
    return cookie.split(';').reduce(
        function(prev, curr) {
            var m = / *([^=]+)=(.*)/.exec(curr);
            var key = m[1];
            var value = decodeURIComponent(m[2]);
            prev[key] = value;
            return prev;
        },
        { }
    );
}

//module.exports.isEmpty = isBlank;
module.exports.currentDate = currentDate;
module.exports.sessionValidation = sessionValidation;
module.exports.isBlank = isBlank;
module.exports.generateToken = generateToken;
module.exports.parseCookies = parseCookies;
//module.exports.uploadingDocument = uploadingDocument;
module.exports.documentStorage = documentStorage;
module.exports.uploadProfilePhoto = uploadProfilePhoto;
