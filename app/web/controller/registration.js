
/*
 *	Controller for Sign In page.
 *	
 *	View : sign-in.html
 *	Author : Nikhil
 */
app.controller('registrationCtrl',function($scope, $cookies, $location, $rootScope, $log, $timeout, HttpCommunicationUtil){
	var ModuleName = "registrationCtrl";
	$rootScope.appTitle = "Registration";

	$scope.passMatch = true;
	$scope.newForm = {
		sQuestion: "-- Select Security Question --",
		usertype: "user"
	}; 

	$scope.submitUser = function(newForm){
		console.log(newForm);
		var userData = {
	      "header": {
	      },
	      "payload": {
	        "username" : newForm.username ,		
			"password": newForm.password,
			"profilephoto": null,
			"usertype": newForm.usertype,
			"buildingname": newForm.buildname,
			"buildingwebsite": newForm.website,
			"address": newForm.addr,
			"securityquestion": {"question": newForm.sQuestion, "answer": newForm.sAnswer ? newForm.sAnswer : null}
	       } 
		};

		HttpCommunicationUtil.doPost('/createuser', userData,function(data, status) {
                if (data.payload.status === "ERROR") {
                	$scope.resTxt = data.payload.responseBody.message;
                }else {
                	$scope.resTxt = data.payload.responseBody.message;
                    $log.debug("User Added successfuly");
                    $scope.newForm = {
						sQuestion: "-- Select Security Question --",
						usertype: "user"
					};
					$timeout(function() {$scope.resTxt ='';}, 3000);
                }       
            },function(err){
                $log.debug(JSON.stringify(err));
         });
	}

	$scope.checkPass = function(){
		if($scope.newForm.password != $scope.newForm.repassword) {
			$scope.passMatch = false;
		} else {
			$scope.passMatch = true;
		}	
	}
});