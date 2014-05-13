Curiosity.controller('curiosityCtrl',[ '$scope', '$http', 'elasticClient', 'ejsResource', 'conf',  
function($scope, $http, elasticClient, ejsResource, conf){	
	/* INITIALISATION */
	var client = elasticClient.getClient(globalConf.defaultServer);
	$scope.info = {};
	$scope.info.tab = 0;
	$scope.info.displayNewServer = false;
	$scope.info.newServer = "";
	$scope.info.mappings = [];
	$scope.info.loading = false;
	$scope.info.err = false;
	$scope.conf = {};
	$scope.info.selectedIndex = "";

	/* EVENTS */
	$scope.$on("ConfLoaded", function() {
		$scope.connectServer(globalConf.defaultServer); /* Init the Index list */
		$scope.info.serverList = conf.getConfDocument("server").servers;
	});
	
	conf.getConf(client, $scope);
	/*
	* selectIndex 
	* Update the selected Index
	*/
	$scope.selectIndex = function () {
		$scope.info.selectedIndex = $scope.info.selectedIndex;
		$scope.$broadcast("IndexChange");
	}
	
	/** 
	* Connect to a new server
	*/
	$scope.connectServer = function (url, addServer) {
		if (url == "")
			return ;
		var serverUrl = url + '/_aliases';
		$http({method: 'GET', url: serverUrl}).
		success(function(data) {
			$scope.info.connected = true;
			$scope.info.indexList = Object.keys(data);
			if (addServer) {
				addServerToConf(client, url);
			}
			$scope.info.selectedServer = url;
			globalConf.curentServer = url;
			$scope.$broadcast("ServerChange");		
		}). error(function() {
			$scope.info.connected = false;
		});
	};
	
	$scope.conf.saveDocument = function(type) {
		conf.sendConfDocument(client, type);
	}
}]);