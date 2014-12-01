// app.js

var Curiosity = angular.module('curiosity', ['elasticsearch', 'ui.select2', 'ui.bootstrap', 'ngAnimate', 'gd.ui.jsonexplorer']);
Curiosity.service('elasticClient', function(esFactory) {
		return { 
			getClient: function(server) {	
          	  return esFactory({
            	    host: server,
            	});
        	}
   		}
   	}
);