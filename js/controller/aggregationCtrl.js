// agregationCtrl.js

Curiosity.controller('aggregationCtrl', function($scope, $templateCache, agg){
	$scope.query.aggregation.aggs = [];
	$scope.aggregation = {};
	$scope.aggregation.possibleAggregation = agg.possibleAggregation;

	$scope.addAggregation = function(array){
		array.push({obj:{},parent:array});
	}

	$scope.modifieAgg = function(aggregation) {
		aggregation.obj = agg.possibleAggregation[aggregation.idx].func();
	}

	$scope.deleteAgg = function(aggregation, idx) {
		aggregation.parent.splice(idx,1);
	}

	$scope.validateAgg = function()
	{
		$scope.query.aggregationArray = agg.builtAggregationArray($scope.query.aggregation.aggs);
	}
});