//"Config file for Angularjs";

angular.module('config', [])
.constant('ENV', {name:'local',apiEndpoint:'http://127.0.0.1:8000'});
.constant('api' : {
    "host" : "api.sandbox.paypal.com",
    "port" : "",            
    "client_id" : "YOUR TEST CLIENT ID",  // your paypal application client id
    "client_secret" : "YOUR TEST CLIENT SECRET" // your paypal application secret id
  });