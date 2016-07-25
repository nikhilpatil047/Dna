/*
 *	Common Controller for all pages.
 *	
 *
 *	Author : Nikhil
 */
app.controller('appController', function($scope, $cookies, $location, $rootScope, $log, requestUtil, HttpCommunicationUtil){
	var ModuleName = "appController";
	//$rootScope.appTitle = "Dashboard";
	$scope.logout = function(){
		$log.info("Start " + ModuleName + ": logOut()");    	
    	var logoutData = $cookies.get('session');
    	if(logoutData){
    		logoutData = JSON.parse(logoutData);
    	}
       	requestUtil.data.header.sessionId = logoutData.sessionId; 
       	requestUtil.data.payload.username = logoutData.user.userName;

       	HttpCommunicationUtil.doPost('/logout', requestUtil.data,function(data, status) {
			if (data.payload.status === "ERROR") {
				alert(data.payload.responseBody.message);
			}else {
				$cookies.remove('session');
				window.location.replace("index.html");
			}		
		},function(err){
            alert(err);
		});
		$log.info("End " + ModuleName + ": logOut()");		
	};
	$scope.$on('$routeChangeStart', function (scope, next, current) {
		var logoutData = $cookies.get('session');
        if (!logoutData) {
            alert("You'r session has been expired please login.");
            window.location.replace("index.html");
        }
    });
});
