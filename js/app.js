// app.js

var Curiosity = angular.module('curiosity', ['elasticsearch', 'ui.select2', 'ui.bootstrap', 'ngAnimate', 'ngCookies','gd.ui.jsonexplorer']);
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

// add this to allow controler in custom result template
Curiosity.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
