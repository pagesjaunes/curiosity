var newContextModalCtrl = function($scope, $modalInstance, context){	
	$scope.nc = {};
	$scope.nc.contextName = "New Context";
	$scope.nc.contextDescr = "";
	$scope.data = context.info;
	$scope.error = false;
	$scope.info = true;

	/**
	* @desc ask contet's service to send context 
	*/
	$scope.newContext = function() {
		if ($scope.contextName == "") {
			$scope.error = true;				
		}
		else {
			context.saveNewContext($scope.nc.contextName, $scope.nc.contextDescr);
			$scope.info = false;
		}
	}

	$scope.cancel = function () {
		$modalInstance.close();
	}
};

var contextManagerModalCtrl = function ($scope, $modalInstance, context) {
	$scope.data = context.info;

	$scope.removeContext = function (id, index) {
	 	context.deleteContext(id);
	 	context.info.contextList.splice(index, 1);
	}

	$scope.close = function () {
		$modalInstance.close();
	}

	$scope.selectContext = function(id) {
		context.loadContext(id);
		$modalInstance.close();
	}
};

Curiosity.controller('contextCtrl', function($scope, context){
	$scope.data = context.info;
});