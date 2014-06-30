Curiosity.controller('moduleManagerCtrl', function($scope, moduleManager){
	$scope.data = moduleManager.info;
	
	$scope.addModule = function (moduleIdx, moduleBlock) {
		if (typeof(moduleIdx) !== "undefined" && moduleIdx >= 0 
			&& typeof($scope.data.moduleList[moduleIdx]) !== "undefined"
			&& typeof (moduleBlock) !== "undefined" && moduleBlock != "") {
			// Create random name for the new module to avoid conflict
			var name = "module" + Math.floor((Math.random() * 1000000) + 1);
			moduleManager.registerModule(name, $scope.data.moduleList[moduleIdx].url,moduleBlock);
		}
	}

	$scope.delModule = function (id) {
		moduleManager.removeModule(id);
	}

	$scope.reinitModules = function () {
		moduleManager.initModule();	
	}
});