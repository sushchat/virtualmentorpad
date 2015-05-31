'use strict';

angular.module('vmp.render', [
		'angular-meteor',
		'babylon'
	])
	.controller('RenderCtrl', function ($scope, BABYLON) {

		// Get the canvas element from our HTML above
		var canvas = document.getElementById('renderCanvas');

		window.devicePixelRatio = 1.0;

		// Load the BABYLON 3D engine
		var engine = new BABYLON.Engine(canvas, true);

		BABYLON.SceneLoader.Load('', 'models/school/school.babylon', engine, function (newScene) {
			// Wait for textures and shaders to be ready
			newScene.executeWhenReady(function () {
				// Attach camera to canvas inputs
				newScene.activeCamera.attachControl(canvas);

				newScene.materials.forEach(function (mat) {
					mat.backFaceCulling = false;
				});

				// Once the scene is loaded, just register a render loop to render it
				engine.runRenderLoop(function () {
					newScene.render();
				});

				var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, newScene);
				var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", newScene);
				skyboxMaterial.backFaceCulling = false;
				skybox.material = skyboxMaterial;
				skybox.infiniteDistance = true;
				skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
				skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
				skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/unity/1", newScene);
				skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			});
		}, function (progress) {
			// To do: give progress feedback to user
		});

		// Watch for browser/canvas resize events
		window.addEventListener('resize', function () {
			engine.resize();
		});

	});
