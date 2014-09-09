/** 
* @desc Controller in charge of Aggregations module
*/
Curiosity.controller('mainAggCtrl', function($scope, aggFactory, moduleManager){
	
	/**
	* @desc add a new aggregation module with a random name to avoid conflict. The aggregation will be create after when 
	* aggCtrl will be initialize
	*/
	$scope.newAggregation = function () {
		name = "agg" +  Math.floor((Math.random() * 10000) + 1);
		moduleManager.registerModule(name, "partials/aggregation_module/aggDisplay.html", "Aggregation");
	}
});