Curiosity.controller('cardCtrl', function($scope, moduleManager, layout){
	$scope.data = moduleManager.info;
	$scope.workspaceData = layout.info;

	$scope.addModule = function (moduleIdx) {
		var moduleBlock = 'w'+ $scope.workspaceData.idx + '-r' + $scope.card.row + '-c' + $scope.card.col;
		if (typeof(moduleIdx) !== "undefined" && moduleIdx >= 0 
			&& typeof($scope.data.moduleList[moduleIdx]) !== "undefined") {
			// Create random name for the new module to avoid conflict
			var name = "module" + Math.floor((Math.random() * 1000000) + 1);
			if ($scope.data.moduleList[moduleIdx].type == "Aggregation") {
				name = "agg" +  Math.floor((Math.random() * 1000000) + 1);
			}
			moduleManager.registerModule(name, $scope.data.moduleList[moduleIdx].url,moduleBlock);
			$scope.showOpt = false;
		}
	}
});