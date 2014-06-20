Curiosity.controller('resultAutoCtrl', function($scope, query, template){
	$scope.templateData = template.info;
	$scope.queryData = query.info;
	$scope.templateSelected = -1;
	$scope.currentTemplate = "";

	$scope.selectTemplate = function (type, id) {
		$scope.currentTemplate = template.addTemplateToCache(type, id);
	}
});