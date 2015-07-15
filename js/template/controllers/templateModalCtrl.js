var templateModalCtrl = function($scope, $modalInstance, template, type){
	$scope.info = {};
	$scope.info.txt = global_text;

	$scope.data = template.info;
	
	$scope.template = {};
	$scope.template.selected = "";

	$scope.template.currentTemplate = {};

	$scope.type = type;

	$scope.getTemplate = function (type, name) {
		$scope.template.currentTemplate = template.getByName(type, name);
	}
	
	$scope.ok = function (customTemplate) {
		$modalInstance.close();
	}

};