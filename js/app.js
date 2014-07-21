var app = angular.module('curiosityDoc', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'curiosity/partials/home.html',
	})
	.when('/Getting-Started', {
		templateUrl: 'curiosity/partials/start.html',
	})
	.when('/Keywords-and-Advanced-Query', {
		templateUrl: 'curiosity/partials/keywords.html',
	})
	.when('/Templating', {
		templateUrl: 'curiosity/partials/templating.html',
	})
	.when('/Aggregations', {
		templateUrl: 'curiosity/partials/aggregations.html',
	})
	.when('/Modules', {
		templateUrl: 'curiosity/partials/modules.html',
	})
	.when('/Contexts', {
		templateUrl: 'curiosity/partials/context.html',
	});
	$locationProvider.html5Mode(true);
});