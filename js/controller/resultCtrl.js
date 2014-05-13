Curiosity.controller('resultCtrl', function($scope , agg){
	
	$scope.$on("queryLaunched", function() {
		$scope.query.prevAgg = agg.cloneAgg($scope.query.aggregation.aggs);
		$scope.query.resultAgg = $scope.query.queryResults.aggregations;
		agg.builtAggregation($scope.query.prevAgg, $scope.query.resultAgg);
	});

	$scope.isAgg = function (key){
		var re = new RegExp("^" + "agg_" + ".*");
		return (re.test(key));
	}

	$scope.hasNestedAgg = function (bucket) {
		var re = new RegExp("^" + "agg_" + ".*");
		for (key in bucket) {
			if (re.test(key))
				return (true);
		}
		return (false);
	}

	$scope.switchPredicate = function (agg, pre1, pre2) {
		console.log (agg);
		if (agg.predicate == pre1) {
			agg.predicate = pre2
		}
		else {
			agg.predicate = pre1
		}
	}

	$scope.addTermsAggregationFilter = function (aggr, bucket) {
		agg.addAggregationFilter($scope.query.aggregationFilter, "Terms", aggr.agg.field, bucket.key)
	}

	$scope.removeAggFilter = function(tab, index)
	{
		tab.splice(index, 1);
	}

	$scope.setBoolOpAggFilter = function (agg, op)
	{
		agg.opBool = op;
	}
})