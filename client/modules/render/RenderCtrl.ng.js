'use strict';

angular.module('vmp.render', [
		'vmp.core',
		'vmp.ui',
		'angular-meteor'
	])
	.controller('RenderCtrl', function ($scope, $rootScene, CubeMapper, DatGUIHelper) {

		$scope.isTouch = (function () {
		  	return !!('ontouchstart' in window) || // works on most browsers
	      		!!('onmsgesturechange' in window); // works on ie10
		})();

		$scope.loading = true;

		$rootScene.init('renderCanvas').then(function () {
			$scope.loading = false;

			DatGUIHelper.init();
		});

	});
