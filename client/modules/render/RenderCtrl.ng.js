'use strict';

angular.module('vmp.render', [
		'vmp.core',
		'angular-meteor',
		'babylon'
	])
	.controller('RenderCtrl', function ($scope, BABYLON, $rootScene, CubeMapper) {

		$rootScene.init().then(function () {
			CubeMapper.setCubeMap('unity/1');
		})

		// Watch for browser/canvas resize events
		window.addEventListener('resize', function () {
			engine.resize();
		});

	});
