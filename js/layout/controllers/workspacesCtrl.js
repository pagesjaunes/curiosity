Curiosity.controller('workspaces',  function($scope, layout){
	$scope.data = layout.info;

	if ($scope.data.workspaces.length == 0) {
		layout.newWorkspace();
	}
	
});