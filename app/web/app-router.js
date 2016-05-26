
var app = angular.module('Dnaapp', ['annotorious','ngTagsInput','ngRoute', 'ngMaterial', 'config', 'ngCookies', 'ngMessages', 'ngSanitize', 'ngStorage', 'ngResource','ngAnimate', 'ngTouch', 'validation.match']);


app.config(['$routeProvider',

  	function($routeProvider) {
	  	$routeProvider.
  		when('/invoices', {
	      templateUrl: 'views/invoice.html' ,
	      controller: 'invoiceController' 
	    }).
	    when('/dashboard', {
	      templateUrl: 'views/dashboard.html' ,
	      controller: 'dashboardController' 
	    }).
	    when('/', {
	      templateUrl: 'views/dashboard.html' ,
	      controller: 'dashboardController' 
	    }).
	    when('/tables', {
	      templateUrl: 'views/tables.html' ,
	      controller: 'tablesController' 
	    }).
	    when('/flot', {
	      templateUrl: 'views/flot.html' ,
	      controller: 'flotController' 
	    }).
	    when('/registration', {
	      templateUrl: 'views/registration.html' ,
	      controller: 'registrationCtrl' 
	    }).
	    when('/morris', {
	      templateUrl: 'views/morris.html' ,
	      controller: 'morrisController' 
	    });
	   
	}],

  function($logProvider){
 	 $logProvider.debugEnabled(true);
	}
);
