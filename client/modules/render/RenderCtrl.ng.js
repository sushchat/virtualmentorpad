'use strict';

angular.module('vmp.render', [
		'vmp.core',
		'vmp.ui',
		'angular-meteor'
	])
	.controller('RenderCtrl', function ($scope, $rootScene, CubeMapper, DatGUIHelper, PointerLockHandler) {

		$rootScene.init('renderCanvas').then(function () {
			DatGUIHelper.init();
			PointerLockHandler.init($rootScene.controls);
		});

	});
