Curiosity.controller('contextCtrl', function($scope, context){	
	$scope.data = context.info;	
	$scope.info.newContextName = "";
	
	/**
	* @desc ask contet's service to send context 
	*/
	$scope.sendContext = function() {
		context.sendContext();
	}

	/**
	* @desc ask context's services to create a new context
	*/
	$scope.saveNewContext = function () {
		context.newContext($scope.info.newContextName); 
	}

	/**
	* @desc set context selected as current context
	*/
	$scope.setDefaultContext = function () {
		context.setDefaultContext($scope.data.currentContext.contextName);
	}
	
	/**
	* @desc update current context
	*/
	$scope.updateContext = function () {
		context.updateContext();
	}

	/**
	* @desc select a context from the context list
	*/
	$scope.selectContext = function () {
		if ($scope.data.contextIdx != null && $scope.data.contextIdx >= 0) {
			context.loadContext($scope.data.contextList[$scope.data.contextIdx]._id);
		}
		else {
			context.setContextIdx();
		}
	}
	
	/**
	* @desc select a context from the context list
	*/
	$scope.deleteContext = function () {
		context.deleteContext();
	}

	/**
	* @desc reload the context list
	*/
	$scope.reloadContextList = function () {
		context.getContextList();
	}
});