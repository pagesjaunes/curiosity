// agregationCtrl.js

Curiosity.controller('aggregationCtrl', function($scope, aggregation, mapping){
	$scope.data = aggregation.info;
	$scope.mappingData = mapping.info;
	$scope.aggregation = {};
	$scope.aggregation.focused = {};

	$scope.addAggregation = function(array){
		aggregation.addAggregation(array);
	}

	$scope.modifieAgg = function(aggre) {
		aggregation.modifieAgg(aggre)
	}

	$scope.deleteAgg = function(aggre, idx) {
		aggregation.deleteAgg(aggre,idx);
	}

	$scope.validateAgg = function()
	{
		aggregation.validateAgg();
	}
});