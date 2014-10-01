Curiosity.controller('init', function($rootScope, $scope, init){
	$scope.confServer = globalConf.confServer;

	$rootScope.$on("ConfCreation", function () {
		$scope.ConfCreation = true;
	});
});