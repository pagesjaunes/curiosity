//mappingCtrl.js

Curiosity.controller('mappingCtrl', ['$scope', 'mapping', 'curiosity',
function($scope, mapping, curiosity){
	$scope.data = mapping.info;

	$scope.$on("IndexChange", function () {
		mapping.updateMapping(curiosity.info.selectedIndex);
	});
	$scope.$on("ServerChange", function () {
		mapping.updateClient(curiosity.info.currentServer);
	});
	$scope.showChange = function (toShow){		
		mapping.updateDisplay(toShow);
	}
}])