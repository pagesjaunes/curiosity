//mappingCtrl.js

Curiosity.controller('mappingCtrl', ['$scope', 'mapping',
function($scope, mapping){
	$scope.data = mapping.info;

	$scope.$on("IndexChange", function () {
		mapping.updateMapping($scope.info.selectedIndex);
	});
	$scope.$on("ServerChange", function () {
		mapping.updateClient(globalConf.curentServer);
	});
	$scope.showChange = function (toShow){		
		mapping.updateDisplay(toShow);
	}
}])