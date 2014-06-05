// agregationCtrl.js
var aggregationCtrl = function($scope, $modalInstance, aggregation, mapping){
	$scope.data = aggregation.info;
	$scope.mappingData = mapping.info;
	$scope.aggregation = {};
	$scope.info = {};
	$scope.info.txt = global_text;
	$scope.aggregation.focused = {};
	$scope.fieldLimit = 9;

	$scope.addAggregation = function(array){
		aggregation.addAggregation(array);
		$scope.aggregation.focused = array[array.length-1];
	}

	$scope.modifieAgg = function(aggre) {
		aggregation.modifieAgg(aggre)
	}

	$scope.deleteAgg = function(aggre, idx) {
		aggregation.deleteAgg(aggre,idx);
	}

	$scope.validateAgg = function(close)
	{
		aggregation.validateAgg();
		$modalInstance.close();	
	}

	$scope.updateLimiteField = function () {
		if ($scope.fieldLimit == 9) {
			$scope.fieldLimit = $scope.mappingData.fields.length;
		}
		else {
			$scope.fieldLimit = 9;
		}
	}
};

Curiosity.controller('aggregationCtrl', aggregationCtrl);