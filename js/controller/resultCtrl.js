Curiosity.controller('resultCtrl', function($scope , agg){
	
	$scope.$on("queryLaunched", function() {
		$scope.query.prevAgg = agg.cloneAgg($scope.query.aggregation.aggs);
		$scope.query.resultAgg = $scope.query.queryResults.aggregations;
		agg.builtAggregation($scope.query.prevAgg, $scope.query.resultAgg);
		// TODO REMOVE 
		if ($scope.query.resultAgg !== "undefined")
			$scope.query.lng = true;
		else 
			$scope.query.lng = false;
	});
	/**
	* isAgg
	* check a string is an aggrgation name
	* @param key : the string to check
	* @return : true if it's match false instead
	*/
	$scope.isAgg = function (key){
		var re = new RegExp("^" + "agg_" + ".*");
		return (re.test(key));
	}

	/**
	* hasNestedAgg 
	* check if a aggregation's bucket have nested aggregation
	*/
	$scope.hasNestedAgg = function (bucket) {
		var re = new RegExp("^" + "agg_" + ".*");
		for (key in bucket) {
			if (re.test(key))
				return (true);
		}
		return (false);
	}

	/**
	* switchPredicate
	* Switch the value of an aggregation predicate between two value passed in parameters
	*/
	$scope.switchPredicate = function (agg, pre1, pre2) {
		if (agg.predicate == pre1) {
			agg.predicate = pre2
		}
		else {
			agg.predicate = pre1
		}
	}
	
	$scope.addTermsAggregationFilter = function (aggr, bucket) {
		agg.addAggregationFilter($scope.query.aggregationFilter, "Terms", aggr.agg.field, bucket.key)
		if ($scope.query.autoRefresh){
			$scope.search();
		}
	}

	$scope.removeAggFilter = function(tab, index)
	{
		tab.splice(index, 1);
		if ($scope.query.autoRefresh){
			$scope.search();
		}
	}

	$scope.setBoolOpAggFilter = function (agg, op)
	{
		var prev = agg.opBool;
		agg.opBool = op;
		if (prev != op){
			$scope.search();
		}
	}
})