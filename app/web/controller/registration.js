
/*
 *	Controller for Sign In page.
 *	
 *	View : sign-in.html
 *	Author : Nikhil
 */
app.controller('registrationCtrl',function($scope, $cookies, $location, $rootScope, $log, $timeout, HttpCommunicationUtil, ngDialog){
	var ModuleName = "registrationCtrl";
	$rootScope.appTitle = "Registration";

	$scope.passMatch = true;
	$scope.newForm = {
		sQuestion: "-- Select Security Question --",
		usertype: "user"
	}; 
	$scope.buldings = [];

	$scope.submitUser = function(newForm){
		console.log(newForm);
		angular.forEach($scope.buldings, function(building){
			if(building._id == newForm.buildingId){
				newForm.buildingname = building.name;
			}
		});
		var userData = {
	      "header": {
	      },
	      "payload": {
	        "username" : newForm.username.toLowerCase() ,		
			"password": newForm.password,
			"profilephoto": null,
			"usertype": newForm.usertype,
			"buildingname": newForm.buildingname,
			"building_id": newForm.buildingId,
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

	$scope.openAddBuilding = function(){
		$scope.newBuilding = {}
		$scope.dialogHdl = ngDialog.open({
            template: 'views/addNewBuilding.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            showClose: true,
            cache: false
        });
	}

	$scope.addBuilding = function() {		
		var data = {
	      "header": {
	      },
	      "payload": {   		
			"bName": $scope.newBuilding.name,
			"dName": $scope.newBuilding.developer,
			"active": true
			} 
		};
		
		HttpCommunicationUtil.doPost('/addBuilding', data, function(data, status) {
                if (data.payload.status === "ERROR") {
                	$scope.resTxt = data.payload.responseBody.message;
                }else {
                	$scope.dialogHdl.close();
                	$scope.resTxt = data.payload.responseBody.message;
                    $log.debug("Building Added successfuly");
                    $scope.newBuilding = {};
                    $scope.getAllBuildings();
					$timeout(function() {$scope.resTxt ='';}, 3000);
                }       
            },function(err){
                $log.debug(JSON.stringify(err));
         });
	}

	$scope.getAllBuildings = function(){
		var userData = {
	      "header": {
	      },
	      "payload": {
	        } 
		};

		HttpCommunicationUtil.doPost('/getAllBuildings', userData,function(data, status) {
                if (data.payload.status === "ERROR") {
                	$scope.resTxt = data.payload.responseBody.message;
                }else {
                	$scope.buldings = data.payload.responseBody.data;
                }       
            },function(err){
                $log.debug(JSON.stringify(err));
         });
	}
	$scope.getAllBuildings();
});