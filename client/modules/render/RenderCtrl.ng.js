'use strict';

angular.module('vmp.render', [
		'vmp.core',
		'vmp.ui',
		'angular-meteor'
	])
	.controller('RenderCtrl', function ($scope, $rootScene, CubeMapper, DatGUIHelper, PointerLockHandler) {

		$scope.loading = true;

		$rootScene.init('renderCanvas').then(function () {
			$scope.loading = false;

			DatGUIHelper.init();
			PointerLockHandler.init($rootScene.controls);
		});

	});
