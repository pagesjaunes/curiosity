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
		$scope.query.aggregationArray = builtAggregationArray($scope.query.aggregation.aggs);
	}

	function builtAggregationArray(array)
	{
		var result = new Array();
		var i = 0;
		while (i < array.length){
			var tmp = array[i].obj.constructor(array[i].obj);
			if (array[i].obj.nested) {
				var nested = builtAggregationArray(array[i].obj.nestedAgg);
				var j = 0;
				while (j < nested.length) {
					tmp.agg(nested[j]);
					j++;
				} 
			}
			result.push(tmp);
			i++;
		}
		return(result);
	} 
});