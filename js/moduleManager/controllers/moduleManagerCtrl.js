Curiosity.controller('moduleManagerCtrl', function($scope, moduleManager){
	$scope.data = moduleManager.info;
	

	$scope.addModule = function (moduleIdx, moduleBlock) {
		if (typeof(moduleIdx) !== "undefined" && moduleIdx >= 0 
			&& typeof($scope.data.moduleList[moduleIdx]) !== "undefined"
			&& typeof (moduleBlock) !== "undefined" && moduleBlock != "") {
			console.log("New Module");
			moduleManager.registerModule("test", $scope.data.moduleList[moduleIdx].url,moduleBlock);
		}
	}

	$scope.delModule = function (id) {
		moduleManager.removeModule(id);
	}

	$scope.reinitModules = function () {
		moduleManager.initModule();	
	}
});