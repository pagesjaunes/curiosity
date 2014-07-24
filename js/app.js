var app = angular.module('curiosityDoc', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'partials/home.html',
	})
	.when('/Installation', {
		templateUrl: 'partials/instal.html',
	})
	.when('/FirstSteps', {
		templateUrl: 'partials/steps.html',
	})
	.when('/Keywords-and-Advanced-Query', {
		templateUrl: 'partials/keywords.html',
	})
	.when('/Templating', {
		templateUrl: 'partials/templating.html',
	})
	.when('/Aggregations', {
		templateUrl: 'partials/aggregations.html',
	})
	.when('/Modules', {
		templateUrl: 'partials/modules.html',
	})
	.when('/Contexts', {
		templateUrl: 'partials/context.html',
	});
});