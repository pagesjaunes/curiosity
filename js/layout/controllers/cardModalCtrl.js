var cardModalCtrl = function($scope, $modalInstance, moduleManager, item){
	$scope.data = moduleManager.info;
	$scope.res = {};
	$scope.res.modules = [];
	$scope.res.styles = "";
	$scope.item = item;
	$scope.selectedModule = new Array($scope.data.moduleList.length);

	var i = 0;
	while (i < $scope.selectedModule.length) {
		$scope.selectedModule[i] = 0;
		i++;
	}

	$scope.addModule = function (idx) {
		$scope.res.modules.push({'name':$scope.data.moduleList[idx].type, idx:idx});
	}

	$scope.removeModule = function (idx) {
		$scope.res.modules.splice(idx, 1);
	}

	$scope.validate = function() {
		$modalInstance.close($scope.res);
	}

	$scope.cancel = function() {
		$modalInstance.dismiss("cancel");
	}

	$scope.selectModule = function (idx) {
		$scope.res.modules.push({'name':$scope.data.moduleList[idx].type, idx:idx});
		$scope.selectedModule[idx]++; 
	}
};