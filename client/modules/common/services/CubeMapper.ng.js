angular
	.module('vmp.core.cubemapper', [
		'babylon'
	])
	.service('CubeMapper',
		function(BABYLON, $rootScene) {
			'use strict';

			this.skybox = null;

			this.setCubeMap = function(cubemap) {
				this.skybox = BABYLON.Mesh.CreateBox('skyBox', 1000.0, $rootScene.scene);
				var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', $rootScene.scene);
				skyboxMaterial.backFaceCulling = false;
				this.skybox.material = skyboxMaterial;
				this.skybox.infiniteDistance = true;
				skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
				skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
				skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('textures/skybox/' + cubemap, $rootScene.scene);
				skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			};

		}
	);
