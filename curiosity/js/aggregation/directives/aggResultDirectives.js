Curiosity.directive('aggResult', function(aggFactory){
	return {	
		scope: {
			agg : '='
		},	
		templateUrl : "template/aggregation_module/aggResult.html",	
		controller : function ($scope) {
			$scope.isAgg = function (key) {
				return (aggFactory.isAgg(key));
			}
			
			$scope.callFuncWithData = function (func) 
				func($scope.agg);
		}
	}
});
