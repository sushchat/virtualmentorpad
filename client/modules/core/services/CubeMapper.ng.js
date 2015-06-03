angular
	.module('vmp.core.cubemapper', [
		'three'
	])
	.service('CubeMapper',
		function(THREE, $rootScene) {
			'use strict';

			this.skybox = null;
			this.skyBoxMaterial = null;

			this.setCubeMap = function(cubemap) {

			};

		}
	);
