var app = angular.module('curiosityDoc', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/curiosity/', {
		templateUrl: 'partials/home.html',
	})
	.when('/curiosity/Getting-Started', {
		templateUrl: 'partials/start.html',
	})
	.when('/curiosity/Keywords-and-Advanced-Query', {
		templateUrl: 'partials/keywords.html',
	})
	.when('/curiosity/Templating', {
		templateUrl: 'partials/templating.html',
	})
	.when('/curiosity/Aggregations', {
		templateUrl: 'partials/aggregations.html',
	})
	.when('/curiosity/Modules', {
		templateUrl: 'partials/modules.html',
	})
	.when('/curiosity/Contexts', {
		templateUrl: 'partials/context.html',
	});
	$locationProvider.html5Mode(true);
});