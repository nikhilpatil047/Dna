app.controller('createInvoiceController',function($scope, $cookies, $location, $rootScope, $log, $timeout, HttpCommunicationUtil, ngDialog){
	var ModuleName = "createInvoiceController";
	$rootScope.appTitle = "Generate Invoices";

	$scope.contacts = [];
	$scope.defaultInvoice = null;
	$scope.generatedInvoices = [];
	var data = $cookies.get('session');
	if(data){
		data = JSON.parse(data);
		$scope.user = data.user;
	}


	$scope.getInvoiceData = function(){
		var userData = {
	      "header": {
	      },
	      "payload": {
	        "bId" : $scope.user.buildingId		
			} 
		};

		HttpCommunicationUtil.doPost('/getTaxTemplate', userData,function(data, status) {
            if (data.payload.status === "ERROR") {
            	$scope.resTxt = data.payload.responseBody.message;
            }else {
            	$scope.defaultInvoice = data.payload.responseBody.data[0].template;
            }
        });
	}
	$scope.getInvoiceData();

	$scope.defineBill = function(){
		$scope.newStructure = {terms: []}
		$scope.dialogHdl = ngDialog.open({
            template: 'views/addNewBillStructure.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            showClose: true,
            cache: false
        });
	}

	$scope.addTerm = function(){
		$scope.newStructure.terms.push({"content" : $scope.newStructure.content, "charge": $scope.newStructure.charge});
		$scope.newStructure.content = "";
		$scope.newStructure.charge = "";
	}

	$scope.createInvoiceTemplate = function(){
		var userData = {
	      "header": {
	      },
	      "payload": {
	        "bId" : $scope.user.buildingId,
	        "template" :  $scope.newStructure.terms		
			} 
		};

		HttpCommunicationUtil.doPost('/addTaxTemplate', userData,function(data, status) {
            if (data.payload.status === "ERROR") {
            	$scope.resTxt = data.payload.responseBody.message;
            }else {
            	$scope.resTxt = "Created default bill structure successfully.";
            }
        });
	}

	$scope.getContacts = function(){
		 var userData = {
		  "header": {
	      },
	      "payload": {
	        "bId" : $scope.user.buildingId 		
			} 
		};

		HttpCommunicationUtil.doPost('/getUsersByBuilding', userData,function(data, status) {
            if (data.payload.status === "ERROR") {
            	$scope.resTxt = data.payload.responseBody.message;
            }else {
            	$scope.contacts = data.payload.responseBody.userDetails;
            }
        });
	}
	$scope.getContacts();

	$scope.generatedInvoices = [];
	$scope.createAndSaveInvioces = function(){
		var generatedInvoices = []
		angular.forEach($scope.contacts, function(user){
			user.invoice = $scope.defaultInvoice;
			user.total = 0;
			angular.forEach($scope.defaultInvoice, function(content){
				user.total = user.total + content.charge*1;
			});
			generatedInvoices.push(user);
		});

		var userData = {
		  "header": {
	      },
	      "payload": {
	        "bId" : $scope.user.buildingId,
	        "month": new Date().getMonth(),
	        "invoices": generatedInvoices
			} 
		};

		HttpCommunicationUtil.doPost('/addTaxInvoices', userData,function(data, status) {
            if (data.payload.status === "ERROR") {
            	$scope.resTxt = data.payload.responseBody.message;
            }else {
            	$scope.generatedInvoices = generatedInvoices;
            	//$scope.contacts = data;
            }
        });
	}
});