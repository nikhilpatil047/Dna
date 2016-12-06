
var app = angular.module('Dnaapp', ['annotorious','ngTagsInput','ngRoute', 'ngMaterial', 'config', 'ngCookies', 'ngMessages', 'ngSanitize', 'ngStorage', 'ngResource','ngAnimate', 'ngTouch', 'ngDialog','validation.match']);


app.config(['$routeProvider',

  	function($routeProvider) {
	  	$routeProvider.
  		when('/invoices', {
	      templateUrl: 'views/invoice.html' ,
	      controller: 'invoiceController' 
	    }).
	    when('/createInvoices', {
	      templateUrl: 'views/createInvoice.html' ,
	      controller: 'createInvoiceController' 
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
	    }).when('/settings', {
			templateUrl : 'views/settings.html',
	    	controller: 'settingsController' 
		}).when('/profile', {
	      templateUrl: 'views/profile.html' ,
	      controller: 'profileController' 
	    })
	    .when('/logout', {
		templateUrl : '/index.html',
	});
	   
	}],

  function($logProvider){
 	 $logProvider.debugEnabled(true);
	}
);
