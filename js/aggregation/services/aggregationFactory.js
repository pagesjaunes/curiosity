Curiosity.factory('aggregation', function(agg){
	aggregationObj = {};
	aggregationObj.info = {};
	aggregationObj.info.prevAgg = {};
	aggregationObj.info.currentAgg = {};
	aggregationObj.info.possibleAgg = agg.possibleAggregation;

	aggregationObj.addAggregation = function (array) {
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


	


	return (aggregationObj);
})