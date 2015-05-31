// serves as the "main" world for the game system
angular
	.module('vmp.core.root-scene', [
		'babylon'
	])
	.service('$rootScene',
		function(BABYLON, $q, $window) {
			'use strict';

			this.engine = null;
			this.scene = null;

			this.init = function (elemId) {

				var deferred = $q.defer();

				// Get the canvas element from our HTML above
				var canvas = document.getElementById(elemId);

				window.devicePixelRatio = 1.0;

				// Load the BABYLON 3D engine
				this.engine = new BABYLON.Engine(canvas, true);

				var me = this;

				BABYLON.SceneLoader.Load('models/school/', 'school.babylon', this.engine, function (newScene) {

					me.scene = newScene;

					// Wait for textures and shaders to be ready
					me.scene.executeWhenReady(function () {
						// Attach camera to canvas inputs
						me.scene.activeCamera.attachControl(canvas);

						me.scene.materials.forEach(function (mat) {
							mat.backFaceCulling = false;
						});

						// Once the scene is loaded, just register a render loop to render it
						me.engine.runRenderLoop(function () {
							me.scene.render();
						});

						deferred.resolve();
					});

				}, function (progress) {
					// To do: give progress feedback to user
				});

				// Watch for browser/canvas resize events
				$window.addEventListener('resize', function () {
					me.engine.resize();
				});

				return deferred.promise;
			}
		}
	);
