app.controller('pageCtrl', function($scope, $rootScope, $location){
	$scope.menu = menu;

	$rootScope.$on("$routeChangeSuccess", function () {
		$scope.page = pages[$location.path()];
		$scope.path = $location.path();
	}); 

});