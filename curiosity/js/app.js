// app.js

var Curiosity = angular.module('curiosity', ['ngAnimate', 'elasticjs.service', 'elasticsearch', 'ngGrid','ui.select2','ui.bootstrap', 'ngCookies' ]);
Curiosity.service('elasticClient', function(esFactory) {
		return { 
			getClient: function(server) {	
          	  return esFactory({
            	    host: server,
            	    apiVersion: '1.0' 
            	});
        	}
   		}
   	}
);