var mappingModalCtrl = function($scope, $modalInstance, mapping){
	$scope.data = mapping.info;

	$scope.fieldLimit = 9;
	$scope.selected = {};
	$scope.fieldFilter = "";

	$scope.updateFieldLimit = function () {
		if ($scope.fieldLimit == 9) {
			$scope.fieldLimit = $scope.data.fields.length;	
		}
		else {
			$scope.fieldLimit = 9;	
		}
	}

	$scope.ok = function () {
		var value = "";
		if (typeof ($scope.selected.ancestor) !== "undefined")
			value = $scope.selected.ancestor;
		$modalInstance.close(value);
	}

	$scope.cancel = function () {
		 $modalInstance.dismiss('cancel');
	}

	$scope.selectField = function(field) {
		$scope.selected = field;
	}
};