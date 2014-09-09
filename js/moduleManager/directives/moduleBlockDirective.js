Curiosity.directive('moduleblock', function(moduleManager){
	return {
		templateUrl: "partials/moduleManager/moduleBlock.html", 
		restrict: 'A',
		scope:{
			'card':'='
		},
		link: function($scope, Elm, Attrs) {
			$scope.info = {};
			$scope.info.txt = global_text;
			$scope.data = moduleManager.info;
			if (typeof(Attrs["name"]) !== "undefined") {
				$scope.moduleBlock = moduleManager.getModuleBlock(Attrs["name"]);
			}

			if (typeof(Attrs["type"]) !== "undefined" && typeof($scope.moduleBlock)) {
				$scope.moduleBlock.type = Attrs["type"];
			}
			
			Elm.on('drop', function(ev){
				ev.preventDefault();
    			var data = ev.originalEvent.dataTransfer.getData("Text");
    			moduleManager.moveModule($scope.moduleBlock.name, data);
    			$scope.$apply();
			});

			Elm.on('dragover', function (ev) {
				ev.preventDefault($scope.moduleBlock);
			})

		}
	};
});

function drag(ev) {
	ev.dataTransfer.setData("Text", ev.target.id);
}
