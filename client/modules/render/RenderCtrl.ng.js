'use strict';

angular.module('vmp.render', [
		'vmp.core',
		'vmp.ui',
		'angular-meteor'
	])
	.controller('RenderCtrl', function ($scope, $rootScene, CubeMapper, DatGUIHelper) {

		$rootScene.init('renderCanvas').then(function () {
			DatGUIHelper.init();
		});

	});
