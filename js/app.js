var app = angular.module('curiosityDoc', ['ngRoute'])
.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'partials/home.html',
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