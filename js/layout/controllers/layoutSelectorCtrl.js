Curiosity.controller('layoutSelectorCtrl', function($scope, layout){
	$scope.data = layout.info;


	$scope.colh = 0;
	$scope.cols = $scope.data.currentWorkspace.col?$scope.data.currentWorkspace.col:1;
	$scope.rowh = 0;
	$scope.rows = $scope.data.currentWorkspace.row?$scope.data.currentWorkspace.row:1;
	$scope.name = $scope.data.currentWorkspace.displayName;

	$scope.highlight = function (x, y) {
		$scope.rowh = x;
		$scope.colh = y;
	}

	$scope.select = function (x, y) {
		$scope.rows = x;
		$scope.cols = y;
	}

	$scope.reinit = function () {
		$scope.rowh = 0;
		$scope.colh = 0;
	}

	$scope.validate = function (name, col, row) {
		if (typeof(name) !== "undefined" && typeof(col) !== "undefined" && typeof(row) !== "undefined") {
			layout.setData(name, col, row);
		}
	}
});