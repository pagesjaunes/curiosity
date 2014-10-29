var templateModalCtrl = function($scope, $modalInstance, template, item){
	$scope.info = {};
	$scope.info.txt = global_text;

	$scope.data = template.info;
	
	$scope.template = {};
	$scope.template.selected = -1;

	$scope.template.currentTemplate = {};

	var itemloc = item;

	$scope.changeTemplate = function (type, obj, attr, index) {
		if (index !== "undefined" && index >= 0) {
			obj[attr] = $scope.data[type][index];
		}
	}
	
	$scope.ok = function (customTemplate) {
		$modalInstance.close();
	}

};