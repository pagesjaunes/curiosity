Curiosity.controller('mainAggCtrl', function($scope, aggFactory, moduleManager){
	$scope.newAggregation = function () {
		name = "agg" +  Math.floor((Math.random() * 10000) + 1);
		moduleManager.registerModule(name, "template/aggregation_module/aggDisplay.html", "Aggregation");
	}
});