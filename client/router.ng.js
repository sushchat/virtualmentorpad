'use strict';

angular.module('vmp.router', [
	'angular-meteor',
	'ui.router',
	'ui.bootstrap',
	'snap',
])
.config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

	$stateProvider

	.state('landing', {
		url: '/landing',
		templateUrl: 'client/modules/landing/landing.ng.html'
		// controller: 'DashboardCtrl'
	})
	.state('render', {
		url: '/',
		templateUrl: 'client/modules/render/render.ng.html',
		controller: 'RenderCtrl'
	})

	;

	$urlRouterProvider.otherwise('/');

})
.run(function ($rootScope, $meteor, $state) {



});
