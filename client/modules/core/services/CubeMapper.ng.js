angular
	.module('vmp.core.cubemapper', [
		'three'
	])
	.service('CubeMapper',
		function (THREE, $rootScene) {
			'use strict';

			this.skybox = null;
			this.skyBoxMaterial = null;

			this.setCubeMap = function (cubemap) {

				if (this.skybox) {
					this.skybox.geometry.dispose();
					this.skybox.material.dispose();
					$rootScene.skyboxScene.remove(this.skybox);
				}

				var path = 'textures/skybox/' + cubemap;
				var format = '.jpg';
				var urls = [
					path + '_px' + format, path + '_nx' + format,
					path + '_py' + format, path + '_ny' + format,
					path + '_pz' + format, path + '_nz' + format
				];

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

				this.skybox = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
				$rootScene.skyboxScene.add(this.skybox);
			};

		}
	);
