var newContextModalCtrl = function($scope, $modalInstance, context){	
	$scope.data = context.info;

	$scope.nc = {};
	$scope.nc.contextName = "Copy of " + $scope.data.currentContext.contextName;
	$scope.nc.contextDesc = $scope.data.currentContext.contextDesc;

	$scope.error = false;
	$scope.info = true;

	/**
	* @desc ask context's service to send context 
	*/
	$scope.newContext = function() {
		if ($scope.contextName == "") {
			$scope.error = true;				
		}
		else {
			context.saveNewContext($scope.nc.contextName, $scope.nc.contextDesc);
			$scope.info = false;
		}
	}

	$scope.cancel = function () {
		$modalInstance.close();
	}
};

var updateContextModalCtrl = function($scope, $modalInstance, context){	
	$scope.data = context.info;

	$scope.error = false;
	$scope.info = true;

	/**
	* @desc ask context's service to send context 
	*/
	$scope.updateContext = function() {
		context.updateContext();
		$scope.info = false;
	}

	$scope.cancel = function () {
		$modalInstance.close();
	}
};


var contextManagerModalCtrl = function ($scope, $modalInstance, context) {
	$scope.data = context.info;

	/**  
	* @desc call contexts service to remove a context
	* @param string id context's id
	* @param int index context's id in context list
	*/
	$scope.removeContext = function (id, index) {
	 	context.deleteContext(id);
	 	context.info.contextList.splice(index, 1);
	}

	$scope.close = function () {
		$modalInstance.close();
	}

	/**
	* @desc ask contexts service to switch context
	* @param string context's id 
	*/
	$scope.selectContext = function(id) {
		context.loadContext(id);
		$modalInstance.close();
	}
};

Curiosity.controller('contextCtrl', function($scope, context){
	$scope.data = context.info;
});