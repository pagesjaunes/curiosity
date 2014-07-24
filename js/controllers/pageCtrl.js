app.controller('pageCtrl', function($scope, $rootScope, $location, $window){
	$scope.menu = menu;

	$rootScope.$on("$routeChangeSuccess", function () {
		$scope.page = pages[$location.path()];
		$scope.path = $location.path();
	}); 

	$rootScope.$on("$viewContentLoaded", function () {
		//$window.ga('send', 'pageview', { page: $location.path() });
	});
});