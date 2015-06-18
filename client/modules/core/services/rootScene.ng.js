// serves as the "main" world for the game system
angular
	.module('vmp.core.root-scene', [
		'vmp.core.input.keyboard',
		'vmp.core.input.keys',
		'physijs',

		'three',	
	])
	.service('$rootScene',
		function(THREE, $q, $window, Keyboard, KEYS, Physijs) {
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

			var createCapsuleGeometry = function () {
			    var merged = new THREE.Geometry();
			    var cyl = new THREE.CylinderGeometry(1, 1, 6);
			    var top = new THREE.SphereGeometry(1);
			    var bot = new THREE.SphereGeometry(1);
			    var matrix = new THREE.Matrix4();
			    matrix.makeTranslation(0, 0.5, 0);
			    top.applyMatrix(matrix);
			    var matrix = new THREE.Matrix4();
			    matrix.makeTranslation(0, -0.5, 0);
			    bot.applyMatrix(matrix);
			    // merge to create a capsule
			    merged.merge(top);
			    merged.merge(bot);
			    // merged.merge(cyl);
			    return merged;
			};			

			rootScene.prototype.init = function (elemId) {

				var deferred = $q.defer();

				// Get the canvas element from our HTML above
				var canvas = document.getElementById(elemId);

				this.scene = new Physijs.Scene();

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

					me.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 100000 );

					dae.updateMatrix();
					// var physicsWorld = new Physijs.ConcaveMesh(dae.geometry, dae.material, 0);
					// physicsWorld.position.copy(dae.position);
					me.scene.add(dae);

					me.controls = new THREE.PointerLockControls( me.camera );

					var capsule_geometry = createCapsuleGeometry();
					var material = new THREE.MeshLambertMaterial({ opacity: 0, transparent: true });

					var player = new Physijs.CapsuleMesh(
						capsule_geometry,
						material,
						undefined,
						{ restitution: Math.random() * 1.5 }
					);
					player.add(me.controls.getObject());
					me.scene.add( player );

					player.setAngularFactor(new THREE.Vector3(0, 0, 0));
					// player.setLinearFactor(new THREE.Vector3(0, 0, 0));

					window.player = player;

					var collisionObjects = [];

					dae.children.forEach(function (child) {
						if (child.name === 'ColBox') {
							// Set to invisible and add to Physijs
							child.visible = false;

							var wrappedChild = child.children[0];

							var physicsMesh = new Physijs.BoxMesh(wrappedChild.geometry, wrappedChild.material, 0);
							physicsMesh.position.copy(child.position);
							me.scene.add(physicsMesh);
						}
						// else {
						// 	// child.visible = false;
						// }
					});

					dae.traverse(function (child) {
						if (child instanceof THREE.PerspectiveCamera) {
							child.updateMatrixWorld();
							player.position.copy(child.parent.position);
							player.__dirtyPosition = true;
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

				this.scene.simulate();
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

	                var inputVector = new THREE.Vector3();

	                // react to changes
	                if (moveForward) {
	                    inputVector.z -= 1;
	                }
	                if (moveBackward) {
	                    inputVector.z += 1;
	                }
	                if (moveLeft) {
	                    inputVector.x -= 1;
	                }
	                if (moveRight) {
	                    inputVector.x += 1;
	                }

					this.controls.rotateVec(inputVector);

					player.applyCentralImpulse(inputVector);

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
