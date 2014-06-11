Curiosity.controller('logCtrl', function($scope, log) {
	
	$scope.data = log.info;	

	$scope.delete = function (index) {
		log.delete(index);
	}

	$scope.clean = function () {
		log.clean();
	}
});