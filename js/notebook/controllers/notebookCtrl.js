Curiosity.controller('notebookCtrl', function($scope, $modal, notebook, query) {
	$scope.data = notebook.info;
	$scope.queryData = query.info;

	/**
	* @desc function call by ng-init, called to load aggregation specifique data, and load template in $templateCache
	* @param string name : the name of the aggregation attached to the controller
	*/ 
	$scope.init = function (name) {
		$scope.curNotebook = {};
		$scope.curNotebook = notebook.getNotebook(name);
		if ($scope.curNotebook.displayResult) {
			notebook.switchDisplay($scope.curNotebook);
		}
		$scope.html = $scope.curNotebook.displayResult;

	}

	$scope.switchDisplay = function() {

		if (!$scope.curNotebook.displayResult) {
			notebook.switchDisplay($scope.curNotebook);
		}
		$scope.curNotebook.displayResult = !$scope.curNotebook.displayResult;
		$scope.html = $scope.curNotebook.displayResult;
	}

	/**
	* @desc function 
	* @param string queryString : the string to search for
	*/ 
	$scope.search = function (queryString) {
		console.log(queryString)
		$scope.queryData.simplifiedRequest = queryString;
		query.search();
	}



	/**
	* @desc function used to open modals in notebook
	* @param string id : the id of the div to display in the modal
	* @param string size (optionnal) : the size (boostrap) of the modal
	*/ 
	$scope.openModal = function (id,size) {
	    var modalInstance = $modal.open({
    	  	templateUrl: id,
      		size: size,
      		controller:function($modalInstance,$scope){
      			$scope.close = function() {
      				$modalInstance.close();
      			}
      		}
    	});
	}

});