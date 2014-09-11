Curiosity.controller('cardCtrl', function($scope, $modal, moduleManager, layout){
	$scope.data = moduleManager.info;
	$scope.workspaceData = layout.info;

	function addModule (moduleIdx) {
		var moduleBlock = $scope.workspaceData.currentWorkspace.name + '-r' + $scope.card.row + '-c' + $scope.card.col;
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

	$scope.openOption = function() {
		openCardModal();	
	} 

	function openCardModal() {
		var modalInstance = $modal.open({
			templateUrl: 'partials/modal/card_options_modal.html',
			controller: cardModalCtrl,
			size: 'lg',
			resolve: {
				item: function () {
					return $scope.card;
				}}
			});
		modalInstance.result.then(function (value) {
			var i = 0;
			while (i < value.modules.length) {
				addModule(value.modules[i].idx);
				i++;
			}
		}, function () {})	
	}
});