Curiosity.controller('contextCtrl', function($scope, context){	
	$scope.data = context.info;	
	$scope.data.contextIdx = -1;
	$scope.newContextName =  "";

	$scope.sendContext = function() {
		context.sendContext();
	}

	$scope.saveNewContext = function () {
		context.newContext($scope.newContextName); 
		context.sendContext();
	}

	$scope.setDefaultContext = function () {
		context.setDefaultContext($scope.data.currentContext.contextName);
	}

	$scope.updateContext = function () {
		context.updateContext();
	}

	$scope.selectContext = function () {
		if ($scope.data.contextIdx != null && $scope.data.contextIdx >= 0) {
			context.loadContext($scope.data.contextList[$scope.data.contextIdx].fields.contextName[0]);
		}
		else {
			context.setContextIdx();
		}
	}
})