// agregationCtrl.js

Curiosity.controller('aggregationCtrl', function($scope, aggregation){
	$scope.data = aggregation.info;
	$scope.addAggregation = function(array){
		aggregation.addAggregation(array);
	}

	$scope.modifieAgg = function(aggre) {
		aggregation.modifieAgg(aggre)
	}

	$scope.deleteAgg = function(aggre, idx) {
		aggregation.deleteAgg(aggre,1);
	}

	$scope.validateAgg = function()
	{
		$scope.query.aggregationArray = agg.builtAggregationArray($scope.query.aggregation.aggs);
	}
});