
var app = angular.module('Dnaapp', ['annotorious','ngTagsInput','ngRoute', 'ngMaterial', 'config', 'ngCookies', 'ngMessages', 'ngSanitize', 'ngStorage', 'ngResource','ngAnimate', 'ngTouch', 'ngDialog','validation.match']);


app.config(['$routeProvider',

  	function($routeProvider) {
	  	$routeProvider.
  		when('/reports', {
	      templateUrl: 'views/reports.html' ,
	      controller: 'reportsController' 
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
	    when('/registration', {
	      templateUrl: 'views/registration.html' ,
	      controller: 'registrationCtrl' 
	    }).
	    when('/morris', {
	      templateUrl: 'views/morris.html' ,
	      controller: 'morrisController' 
	    }).
	    when('/settings', {
			templateUrl : 'views/settings.html',
	    	controller: 'settingsController' 
		}).
		when('/profile', {
	      templateUrl: 'views/profile.html' ,
	      controller: 'profileController' 
	    }).
	    when('/help', {
	      templateUrl: 'views/help.html' ,
	      controller: 'helpController' 
	    }).
	    when('/FAQ', {
	      templateUrl: 'views/faq.html' ,
	      controller: 'faqController' 
	    }).
	    when('/security', {
	      templateUrl: 'views/security.html' ,
	      controller: 'securityController' 
	    }).
	    when('/vendor', {
	      templateUrl: 'views/vendor.html' ,
	      controller: 'vendorController' 
	    }).
	    when('/Asset', {
	      templateUrl: 'views/asset.html' ,
	      controller: 'assetController' 
	    }).
	    when('/docSetup', {
	      templateUrl: 'views/docSetup.html' ,
	      controller: 'documentSetupController' 
	    }).
	    when('/onlinePayment', {
	      templateUrl: 'views/onlinePayment.html' ,
	      controller: 'onlinePaymentController' 
	    })
	    .when('/logout', {
		templateUrl : '/index.html',
	});
	   
	}],

  function($logProvider){
 	 $logProvider.debugEnabled(true);
	}
);
