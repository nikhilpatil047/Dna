//Service for authentication of user.
app.service('authService', function(HttpCommunicationUtil, $location, $log, $cookies, requestUtil, userService, utilService) {

	var ModuleName = "authService"; 

	/* Function which hits api '/user/login'
		@param loginData
		@param callback
	*/
	this.login = function(loginData, callback) {
		$log.info("Start " + ModuleName + ": login()");    	
        // Encrypt the data;
        var secKey = $cookies.getObject('sKey');        
		
		// loginData.password = utilService.encryptData(loginData.password, secKey.key);
		// loginData.userEmail = utilService.encryptData(loginData.userEmail, secKey.key);
		requestUtil.data.payload = {};
		requestUtil.data.payload.userEmail = loginData.userEmail;
		requestUtil.data.payload.password = loginData.password;
		requestUtil.data.token = secKey.token;
		var encrypted = utilService.encryptData(JSON.stringify(requestUtil.data.payload), secKey.key);
		requestUtil.data.payload = encrypted.toString();

       	// $log.debug("User request"+JSON.stringify(requestUtil.data));
       	
       	// AJAX call to authentication API.
       	HttpCommunicationUtil.doPost('/user/login',requestUtil.data,function(data, status) {
       		var decrypted = utilService.decryptData(data.payload.responseBody, secKey.key);
				data.payload.responseBody = JSON.parse(decrypted);
			if (data.payload.status === "ERROR") {				
				var err = {"responseCode": data.payload.responseCode,"status":data.payload.status, "message":data.payload.responseBody.message, "userEmail" : loginData.userEmail};
				callback(err, null);
			}else {				
				var obj = {};
				obj.sessionId = data.payload.sessionId;
				obj.user = data.payload.responseBody.userDetails;
				obj.user.userEmail = loginData.userEmail;
				if(loginData.staySignedIn){
					var expireDate = new Date();
	  				expireDate.setDate(expireDate.getDate() + 15);			
					$cookies.putObject('session', obj, {'expires': expireDate});
				} else {
					$cookies.putObject('session', obj);
				}			
				
				callback(null, data);
			}		

			$log.debug("Response received for login request");
		},function(err){
            var error = {"status":"ERROR", "message":err};
            callback(error, null);
		});
		$log.info("End " + ModuleName + ": login()");		
	}

	/* Function which hits api '/user/logout'
		@param logoutData
		@param callback
	*/
	this.logOut = function(logoutData, callback) {
		$log.info("Start " + ModuleName + ": logOut()");    	
     
       	requestUtil.data.header.sessionId = logoutData.sessionId; 
       	requestUtil.data.payload.userid = logoutData.userId;

       	HttpCommunicationUtil.doPost('/logout',requestUtil.data,function(data, status) {
			if (data.payload.status === "ERROR") {
				var err = {"status":data.payload.status, "message":data.payload.responseBody.message};
				callback(err, null);
			}else {
				$cookies.remove('session');
				callback(null, data);
			}		
		},function(err){
            var error = {"status":"ERROR", "message":err};
            callback(error, null);
		});
		$log.info("End " + ModuleName + ": logOut()");		
	}	
});