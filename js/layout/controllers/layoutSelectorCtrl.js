Curiosity.controller('layoutSelectorCtrl', function($scope, layout){
	$scope.colh = 0;
	$scope.cols = 2;
	$scope.rowh = 0;
	$scope.rows = 2;
	$scope.name = "New Workspace";

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