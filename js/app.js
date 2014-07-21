var app = angular.module('curiosityDoc', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/curiosity/', {
		templateUrl: 'curiosity/partials/home.html',
	})
	.when('/curiosity/Getting-Started', {
		templateUrl: 'curiosity/partials/start.html',
	})
	.when('/curiosity/Keywords-and-Advanced-Query', {
		templateUrl: 'curiosity/partials/keywords.html',
	})
	.when('/curiosity/Templating', {
		templateUrl: 'curiosity/partials/templating.html',
	})
	.when('/curiosity/Aggregations', {
		templateUrl: 'curiosity/partials/aggregations.html',
	})
	.when('/curiosity/Modules', {
		templateUrl: 'curiosity/partials/modules.html',
	})
	.when('/curiosity/Contexts', {
		templateUrl: 'curiosity/partials/context.html',
	});
	$locationProvider.html5Mode(true);
});