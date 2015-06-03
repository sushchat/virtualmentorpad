// serves as the "main" world for the game system
angular
	.module('vmp.core.root-scene', [
		'three'
	])
	.service('$rootScene',
		function(THREE, $q, $window) {
			'use strict';

			var rootScene = function () {
				this.renderer = null;
				this.scene = null;
				this.camera = null;
				this.controls = null;
			};

			rootScene.prototype.init = function (elemId) {

				var deferred = $q.defer();

				// Get the canvas element from our HTML above
				var canvas = document.getElementById(elemId);

				// if(navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
				// 	window.devicePixelRatio = 1.0;
				// }

				this.scene = new THREE.Scene();
				this.skyboxScene = new THREE.Scene();

				var me = this;

				this.renderer = new THREE.WebGLRenderer({
					canvas: canvas
				});
				this.renderer.setPixelRatio( 1.0 );
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.autoClear = false;

				var loader = new THREE.ColladaLoader();
				loader.options.convertUpAxis = true;
				loader.load('models/school/school.dae', function (collada) {

					var dae = collada.scene;

					dae.traverse(function (child) {
						if (child instanceof THREE.PerspectiveCamera) {
							me.camera = child;
							window.camera = me.camera;
						}
					});

					// dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
					dae.updateMatrix();
					me.scene.add(dae);


					// Collada wraps the camera in a parent object
					// so we need to detach it from the parent
					me.camera.parent.updateMatrixWorld();
					THREE.SceneUtils.detach(me.camera, me.camera.parent, me.scene);
					// THREE.SceneUtils.attach(child, dae, dae.parent.parent);


					// me.controls = new THREE.FirstPersonControls( me.camera );
	    //             me.controls.movementSpeed = 1;
	    //             me.controls.lookSpeed = 0.05;
	    //             me.controls.noFly = true;
	                // me.controls.lookVertical = false;
					me.controls = new THREE.OrbitControls(me.camera, canvas);
					// me.controls.autoRotate = true;
					me.controls.damping = 0.2;

					// me.controls = new THREE.FlyControls( me.camera );
					// me.controls.movementSpeed = 100.0;
					// me.controls.rollSpeed = 0.5;
					// me.controls.dragToLook = true;

					// me.controls = new THREE.PointerLockControls( camera );
					// me.scene.add( controls.getObject() );

	                me.animate();


					deferred.resolve();
				});

				window.addEventListener('resize', this.resize.bind(this), false);

				return deferred.promise;
			};

			rootScene.prototype.animate = function () {
				requestAnimationFrame(this.animate.bind(this));

				this.render();
				this.update();
			}

			rootScene.prototype.render = function () {
				this.renderer.render( this.skyboxScene, this.camera );
				this.renderer.render( this.scene, this.camera );
			};

			rootScene.prototype.update = function () {
                this.controls.update(0.01);
                // this.camera.position.x += 0.01;
			};

			rootScene.prototype.resize = function () {

				// windowHalfX = window.innerWidth / 2;
				// windowHalfY = window.innerHeight / 2;

				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();

				// cameraCube.aspect = window.innerWidth / window.innerHeight;
				// cameraCube.updateProjectionMatrix();

				this.renderer.setSize( window.innerWidth, window.innerHeight );

			}

			return new rootScene();
		}
	);
