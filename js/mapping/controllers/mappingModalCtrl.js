var mappingModalCtrl = function($scope, $modalInstance, mapping, item){
	$scope.data = mapping.info;
	var itemloc = item;
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
		var res = {"value":"", item:itemloc};
		if (typeof ($scope.selected.ancestor) !== "undefined")
			res.value = $scope.selected.ancestor;
		$modalInstance.close(res);
	}

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	}

	$scope.selectField = function(field) {
		$scope.selected = field;
	}
};