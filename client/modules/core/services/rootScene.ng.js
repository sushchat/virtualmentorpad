// serves as the "main" world for the game system
angular
	.module('vmp.core.root-scene', [
		'vmp.core.input.keyboard',
		'vmp.core.input.keys',

		'three',		
	])
	.service('$rootScene',
		function(THREE, $q, $window, Keyboard, KEYS) {
			'use strict';

			var controlsEnabled = false;

			var prevTime = performance.now();
			var velocity = new THREE.Vector3();

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

					me.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );

					dae.updateMatrix();
					me.scene.add(dae);

					me.controls = new THREE.PointerLockControls( me.camera );
					me.scene.add( me.controls.getObject() );

					dae.traverse(function (child) {
						if (child instanceof THREE.PerspectiveCamera) {
							child.updateMatrixWorld();
							me.controls.getObject().position.copy(child.position);
							window.controls = me.controls;
						}
					});					

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
				this.renderer.render( this.scene, this.camera );
			};

			rootScene.prototype.update = function () {
				if ( this.controls.enabled ) {

					var moveForward = false;
					var moveBackward = false;
					var moveLeft = false;
					var moveRight = false;					

		            // keyboard controls
		            if (Keyboard.getKey(KEYS.W) || Keyboard.getKey(KEYS.UP)) {
		                moveForward = true;
		            }

		            if (Keyboard.getKey(KEYS.S) || Keyboard.getKey(KEYS.DOWN)) {
		                moveBackward = true;
		            }

		            if (Keyboard.getKey(KEYS.A) || Keyboard.getKey(KEYS.LEFT)) {
		                moveLeft = true;
		            }

		            if (Keyboard.getKey(KEYS.D) || Keyboard.getKey(KEYS.RIGHT)) {
		                moveRight = true;
		            }			

					var time = performance.now();
					var delta = ( time - prevTime ) / 1000;

					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;

					if ( moveForward ) {
						velocity.z -= 400.0 * delta;
					}

					if ( moveBackward ) {
						velocity.z += 400.0 * delta;
					}

					if ( moveLeft ) {
						velocity.x -= 400.0 * delta;
					}

					if ( moveRight ) {
						velocity.x += 400.0 * delta;
					}

					this.controls.getObject().translateX( velocity.x * delta );
					this.controls.getObject().translateZ( velocity.z * delta );

					console.log(moveForward);

					prevTime = time;

				}  
			};

			rootScene.prototype.resize = function () {
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();

				this.renderer.setSize( window.innerWidth, window.innerHeight );
			}

			return new rootScene();
		}
	);
