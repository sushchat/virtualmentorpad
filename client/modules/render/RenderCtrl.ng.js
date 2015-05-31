'use strict';

angular.module('vmp.render', [
		'vmp.core',
		'vmp.ui',
		'angular-meteor',
		'babylon'
	])
	.controller('RenderCtrl', function ($scope, BABYLON, $rootScene, CubeMapper, DatGUIHelper) {

		$rootScene.init().then(function () {
			DatGUIHelper.init();
		});

	});
