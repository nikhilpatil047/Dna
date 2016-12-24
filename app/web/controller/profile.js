app.controller('profileController', function($scope, $cookies, $location, $rootScope, $log, requestUtil, HttpCommunicationUtil){
	var ModuleName = "profileController";
	$rootScope.appTitle = "Profile";
	$scope.userForm = {
		'isEmpty': true,
		'fName': 'NA',
		'lName': 'NA',
		'email': 'NA',
		'contact': 'NA',
		'dob': 'NA'
	}
	//$scope.userForm = {};
	var logoutData = $cookies.get('session');
	if(logoutData){
		logoutData = JSON.parse(logoutData);
		$scope.user = logoutData.user;
	}
	$scope.getUserDetails = function(){
		requestUtil.data.header.sessionId = logoutData.sessionId; 
       	requestUtil.data.payload.uId = logoutData.user.id;

       	HttpCommunicationUtil.doPost('/getUserDetail', requestUtil.data,function(data, status) {
			if (data.payload.status === "ERROR") {
				alert(data.payload.responseBody.message);
			}else {
				if(data.payload.responseBody.userDetails){
					$scope.userForm = data.payload.responseBody.userDetails;
				}		
			}		
		},function(err){
            alert(err);
		});
		$log.info("End " + ModuleName + ": getUserDetails()");	
	}
	$scope.getUserDetails();
	$scope.updateUserDetails = function(){
		requestUtil.data.header.sessionId = logoutData.sessionId; 
		$scope.userForm.building_id = logoutData.user.buildingId;
       	requestUtil.data.payload = $scope.userForm;

       	HttpCommunicationUtil.doPut('/updateDetail', requestUtil.data,function(data, status) {
			if (data.payload.status === "ERROR") {
				alert(data.payload.responseBody.message);
			}else {
				$scope.userForm = data.payload.responseBody.userDetails;
				$scope.edit = false;
			}		
		},function(err){
            alert(err);
		});
		$log.info("End " + ModuleName + ": updateUserDetails()");
	}

	$scope.addUserDetails = function(){
		requestUtil.data.header.sessionId = logoutData.sessionId; 
		$scope.userForm.uId = logoutData.user.id;
		$scope.userForm.building_id = logoutData.user.buildingId;
       	requestUtil.data.payload = $scope.userForm;

       	HttpCommunicationUtil.doPost('/addDetails', requestUtil.data,function(data, status) {
			if (data.payload.status === "ERROR") {
				alert(data.payload.responseBody.message);
			}else {
				$scope.userForm = data.payload.responseBody.userDetails;
			}		
		},function(err){
            alert(err);
		});
		$log.info("End " + ModuleName + ": updateUserDetails()");
	}
	
});