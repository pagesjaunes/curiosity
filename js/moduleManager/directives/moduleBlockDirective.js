Curiosity.directive('moduleblock', function(moduleManager){
	return {
		templateUrl: "template/moduleManager/moduleBlock.html", 
		restrict: 'A',
		link: function($scope, Elm, Attrs) {
			if (typeof(Attrs['name']) !== "undefined") {
				$scope.moduleBlock = moduleManager.getModuleBlock(Attrs['name']);
				console.log($scope.moduleBlock);
			} 
		}
	};
});