// serves as the "main" world for the game system
angular
	.module('vmp.core.root-scene', [
		'three'
	])
	.service('$rootScene',
		function(THREE, $q, $window) {
			'use strict';

			this.renderer = null;
			this.scene = null;
			this.camera = null;

			this.init = function (elemId) {

				var deferred = $q.defer();

				// Get the canvas element from our HTML above
				var canvas = document.getElementById(elemId);

				// if(navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
				// 	window.devicePixelRatio = 1.0;
				// }

				this.scene = new THREE.Scene();

				var me = this;

				this.renderer = new THREE.WebGLRenderer({
					canvas: canvas
				});
				this.renderer.setPixelRatio( 1.0 );
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.autoClear = false;

				var loader = new THREE.ColladaLoader();
				// loader.options.convertUpAxis = true;
				loader.load('models/school/school.dae', function (collada) {

					var dae = collada.scene;

					dae.traverse(function (child) {
						if (child instanceof THREE.PerspectiveCamera) {
							me.camera = child;
						}
					});

					// dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
					dae.updateMatrix();
					me.scene.add(dae);

					requestAnimationFrame( me.render.bind(me) );

					deferred.resolve();
				});

				window.addEventListener('resize', this.resize.bind(this), false);

				return deferred.promise;
			};

			this.render = function () {
				// renderer.render( sceneCube, cameraCube );
				this.renderer.render( this.scene, this.camera );
			};

			this.resize = function () {

				// windowHalfX = window.innerWidth / 2;
				// windowHalfY = window.innerHeight / 2;

				// camera.aspect = window.innerWidth / window.innerHeight;
				// camera.updateProjectionMatrix();

				// cameraCube.aspect = window.innerWidth / window.innerHeight;
				// cameraCube.updateProjectionMatrix();

				this.renderer.setSize( window.innerWidth, window.innerHeight );

			}
		}
	);
