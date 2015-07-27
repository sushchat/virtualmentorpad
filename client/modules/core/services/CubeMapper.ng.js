angular
	.module('vmp.core.cubemapper', [
		'three'
	])
	.service('CubeMapper',
		function (THREE, $rootScene, assetsUrl) {
			'use strict';

			this.skybox = null;
			this.skyBoxMaterial = null;

			this.setCubeMap = function (cubemap) {

				if (this.skybox) {
					this.skybox.geometry.dispose();
					this.skybox.material.dispose();
					$rootScene.scene.remove(this.skybox);
				}

				var path = assetsUrl + 'textures/skybox/' + cubemap;
				var format = '.jpg';
				var urls = [
					path + '_px' + format, path + '_nx' + format,
					path + '_py' + format, path + '_ny' + format,
					path + '_pz' + format, path + '_nz' + format
				];

				THREE.ImageUtils.crossOrigin = 'Anonymous';
				var reflectionCube = THREE.ImageUtils.loadTextureCube(urls);
				reflectionCube.format = THREE.RGBFormat;

				// Skybox
				var shader = THREE.ShaderLib["cube"];
				shader.uniforms["tCube"].value = reflectionCube;

				var material = new THREE.ShaderMaterial({
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				});

				this.skybox = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000), material);
				$rootScene.scene.add(this.skybox);
			};

		}
	);
