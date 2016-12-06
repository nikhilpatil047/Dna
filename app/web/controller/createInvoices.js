app.controller('createInvoiceController',function($scope, $cookies, $location, $rootScope, $log, $timeout, HttpCommunicationUtil, ngDialog){
	var ModuleName = "createInvoiceController";
	$rootScope.appTitle = "Generate Invoices";

	$scope.contacts = [];
	$scope.defaultInvoice = {};
	$scope.generatedInvoices = [];

	$scope.getInvoiceData = function(){
		var userData = {
	      "header": {
	      },
	      "payload": {
	        "bId" : newForm.username 		
			} 
		};

		HttpCommunicationUtil.doPost('/getTaxTemplate', userData,function(data, status) {
            if (data.payload.status === "ERROR") {
            	$scope.resTxt = data.payload.responseBody.message;
            }else {
            	$scope.defaultInvoice = data;
            }
        });
	}

	$scope.createInvoiceTemplate = function(){
		var userData = {
	      "header": {
	      },
	      "payload": {
	        "bId" : newForm.username 		
			} 
		};

		HttpCommunicationUtil.doPost('/addTaxTemplate', userData,function(data, status) {
            if (data.payload.status === "ERROR") {
            	$scope.resTxt = data.payload.responseBody.message;
            }else {
            	$scope.defaultInvoice = data;
            }
        });
	}

	$scope.getContacts = function(){
		 var userData = {
		  "header": {
	      },
	      "payload": {
	        "bId" : newForm.username 		
			} 
		};

		HttpCommunicationUtil.doPost('/getUsersByBuilding', userData,function(data, status) {
            if (data.payload.status === "ERROR") {
            	$scope.resTxt = data.payload.responseBody.message;
            }else {
            	$scope.contacts = data;
            }
        });
	}
	$scope.getContacts();

	$scope.createAndSaveInvioces = function(){
		var userData = {
		  "header": {
	      },
	      "payload": {
	        "bId" : newForm.username,
	        "month": newDate().month(),
	        "invoices": $scope.generatedInvoices
			} 
		};

		HttpCommunicationUtil.doPost('/getUsersByBuilding', userData,function(data, status) {
            if (data.payload.status === "ERROR") {
            	$scope.resTxt = data.payload.responseBody.message;
            }else {
            	$scope.contacts = data;
            }
        });
	}
});