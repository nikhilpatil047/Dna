
/*
 *	Controller for Sign In page.
 *	
 *	View : sign-in.html
 *	Author : Nikhil
 */
app.controller('dashboardController',function($scope, $cookies, $location, $rootScope, $log){
	var ModuleName = "dashboardController";
	$rootScope.appTitle = "Dashboard";
	
	$scope.chat = [
		{
			date:"28/1/2016",	
			time:"12:30 pm",	
			username:"A",	
			msg:"hi"
		}, 
		{
			date:"28/1/2016",	
			time:"12:31 pm",	
			username:"S",	
			msg:"hi"
		},  
		{
			date:"28/1/2016",	
			time:"12:32 pm",	
			username:"A",	
			msg:"wat's up?"
		} ];
	//console.log($scope.chat);
	$scope.addText = function()
	{
		//console.log($scope.addmessage);
		//if (!$scope.addmessage) {return;}    
		$scope.dateObj = new Date();
		$scope.dd = $scope.dateObj.getDate();
		$scope.mm = $scope.dateObj.getMonth()+1; //January is 0!
		$scope.yyyy = $scope.dateObj.getFullYear();
		$scope.today = $scope.dd+'/'+$scope.mm+'/'+$scope.yyyy;
		$scope.hours = $scope.dateObj.getHours();
		$scope.minutes = $scope.dateObj.getMinutes();
		$scope.timestate = $scope.hours > 12 ? "pm" : "am";
		$scope.time = $scope.hours+"."+$scope.minutes+" "+$scope.timestate;//$scope.dateObj.getTime();

		console.log($scope.time);
		$scope.chat.push({
			date:$scope.today,	
			time:$scope.time,	
			username:"A",	
			msg:$scope.addmessage
		});
		$scope.addmessage = "";
		//console.log($scope.chat);
	};
});



var application = angular.module("basic_Poll_Forum",[]);

application.controller("myPoll_ctrl",function($scope){

	$scope.products  = ["bread", "milk", "egg"];
	
	$scope.add = function()
	{
		
		$scope.errortext = "";
        if (!$scope.addmessage) {return;}
        if ($scope.products.indexOf(($scope.addmessage).toLowerCase()) == -1) 
		{
			$scope.products.push(($scope.addmessage).toLowerCase());
		}
		else
		{
			$scope.errortext = "The item is already in your shopping list.";
		}
	};
	$scope.removeItem = function (x) 
	{
		$scope.errortext = "";
		$scope.products.splice(x, 1);
    };
});