var HttpCommunicationUtil = function($http, $rootScope, ENV) {
	var factory = {};
	var baseUrl = ENV.apiEndpoint;

factory.doPost = function(url, data, successCallbackFunction, errorCallbackFunction){
	$http.post(baseUrl + url, data)
	.success(function(data, status, headers, config){
			if(undefined == data.code)
			{
				data["code"] = "NA";
			}
			if(data.payload != undefined) {
				if(data.payload.responseCode == "E0017" || data.payload.responseCode == "E0019" || data.payload.responseCode == "E0013"){
	                $rootScope.logOut();
	            }
			}			
			successCallbackFunction(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			console.log("Error callback called for url: "+url+" with POST method with status: "+status+" and data: ");
			console.log(data);
			if(null!=data && undefined == data.code)
			{
				data = {};
				data["code"] = "NA";
				
				if((null!=data.message && data.message.indexOf("AccessDeniedException")>-1)||status=="403"){
	        		// TODO: Add message to show access denied
					//$rootScope.ShowFullScreenLoading = false;
	        	}else{
	        		errorCallbackFunction(data, status, headers, config);
	        	}
			}
		});
	},
	factory.doPut = function(url, data, successCallbackFunction, errorCallbackFunction){
		$http.put(baseUrl + url, data)
		.success(function(data, status, headers, config){
			if(undefined == data.code)
			{
				data["code"] = "NA";
			}
			if(data.payload.responseCode == "E0017" || data.payload.responseCode == "E0019" || data.payload.responseCode == "E0013"){
                $rootScope.logOut();
            }
			successCallbackFunction(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			console.log("Error callback called for url: "+url+" with PUT method with status: "+status+" and data: ");
			console.log(data);
			if(null!=data && undefined == data.code)
			{
				data = {};
				data["code"] = "NA";
				
				if((null!=data.message && data.message.indexOf("AccessDeniedException")>-1)||status=="403"){
	        		// TODO: Add message to show access denied
					//$rootScope.ShowFullScreenLoading = false;
	        	}else{
	        		errorCallbackFunction(data, status, headers, config);
	        	}
			}
		});
	},

	factory.doGet = function(url, successCallbackFunction, errorCallbackFunction, params, forbiddenCallbackFunction){
		$http.get(baseUrl + url, {params: params}, {timeout: 10000})
		.success(function(data, status, headers, config){
			if(undefined == data.code)
			{
				data["code"] = "NA";
			}
			if(data.payload) {
				if(data.payload.responseCode == "E0017" || data.payload.responseCode == "E0019" || data.payload.responseCode == "E0013"){
	                $rootScope.logOut();
	            }
			}			
			successCallbackFunction(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			console.log("Error callback called for url: "+url+" with method GET with status: "+status+" and data: ");
			console.log(data);
			if(null!=data && undefined == data.code)
			{
				data = {};
				data["code"] = "NA";
				
				if((null!=data.message && data.message.indexOf("AccessDeniedException")>-1)||status=="403"){
	        		// TODO: Add message to show access denied
					//$rootScope.ShowFullScreenLoading = false;
					forbiddenCallbackFunction(data);
	        	}else{
	        		errorCallbackFunction(data, status, headers, config);
	        	}
			}
		});
	};
	
	factory.doDelete = function(url, successCallbackFunction, errorCallbackFunction){
		var finalUrl = baseUrl + url;
		$http.delete(finalUrl)
		.success(function(data, status, headers, config){
			if(undefined == data.code)
			{
				data["code"] = "NA";
			}
			if(data.payload.responseCode == "E0017" || data.payload.responseCode == "E0019" || data.payload.responseCode == "E0013"){
                $rootScope.logOut();
            }
			successCallbackFunction(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			console.log("Error callback called for url: "+url+" with method DELETE status: "+status+" and data: ");
			console.log(data);
			if(null!=data && undefined == data.code)
			{
				data = {};
				data["code"] = "NA";
				
				if((null!=data.message && data.message.indexOf("AccessDeniedException")>-1)||status=="403"){
	        		// TODO: Add message to show access denied
					//$rootScope.ShowFullScreenLoading = false;
	        	}else{
	        		errorCallbackFunction(data, status, headers, config);
	        	}
			}
		});
	};
	
	factory.jsonP = function(url, successCallbackFunction, errorCallbackFunction){
		$http.jsonp(url);
	};

	return factory;
};
if(typeof app !== 'undefined') {
	app.factory('HttpCommunicationUtil', HttpCommunicationUtil);
}