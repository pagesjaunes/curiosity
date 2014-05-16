Curiosity.factory('result', function(query, template){
	var resultObj = {};
	resultObj.info = {};
	resultObj.info.useTemplate = false;
	resultObj.info.currentTemplate = "";
	
	resultObj.changeCurrentTemplate = function(type, templateId) {	
		resultObj.info.currentTemplate = template.addTemplateToCache(type, templateId);
		if (resultObj.info.currentTemplate == "") {
			resultObj.info.useTemplate = false;
		}
		else {
			resultObj.info.useTemplate = true;
		}
	}
	return (resultObj);
})

/*	selectTemplate = function () {
	$scope.query.template = $scope.template.list[$scope.query.templateSelected];
		if (typeof($scope.query.template) !== "undefined") {
			$templateCache.put($scope.query.template.name, $scope.query.template.value);
				$scope.query.useTemplate = false;
				$scope.query.useTemplate = true;
			}
		}*/
