Curiosity.controller('historyCtrl',function($scope, history, query){

	$scope.data = history.info;

	/*
	 * Call ES with a query given query (used for history)
	 */
	$scope.searchFromHistory = function(pQuery){
		query.info.simplifiedRequest = pQuery; 
		query.search()
	};
});