// serves as the "main" world for the game system
angular
	.module('vmp.core.root-scene', [
		'vmp.core.input.keyboard',
		'vmp.core.input.keys',
		'vmp.core.input.gameController',

		'three',
	])
	.service('$rootScene',
		function(THREE, $q, $window, Keyboard, KEYS, $modal, assetsUrl, GameController) {
			'use strict';

			var controlsEnabled = false;

			var prevTime = performance.now();
			var velocity = new THREE.Vector3();

			var raycaster = new THREE.Raycaster();

			var gameObjects = {};
			var isNearbyKiosk = false;

			var player = null;

			var rootScene = function () {
				this.renderer = null;
				this.scene = null;
				this.camera = null;
				this.controls = null;
			};

			var teleportPlayer = function (target) {
				var yawObject = player.children[0];

				player.position.copy(target.position);

				// For now, rotations need to be hardcoded
				// as I'm unable to change the pointerlockcontrols rotation straight
				// from a matrix
				if (target.name === 'PlayerStartHall') {
					yawObject.rotation.y = -Math.PI / 2;
				}
			};

			rootScene.prototype.init = function (elemId) {

				var deferred = $q.defer();

				// Get the canvas element from our HTML above
				var canvas = document.getElementById(elemId);

				this.scene = new THREE.Scene();

				var me = this;

				this.renderer = new THREE.WebGLRenderer({
					canvas: canvas
				});
				this.renderer.setPixelRatio( 1.0 );
				this.renderer.setClearColor( 0xff0000 );
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				// this.renderer.autoClear = false;

				this.renderer.getSize = function () {
					return {
						width:  window.innerWidth,
						height: window.innerHeight
					};
				};

				this.vrEffect = new THREE.VREffect(this.renderer, function (err) {
					if (err) {
						console.error(err);
					}
				});
				this.vrEffect.setSize( window.innerWidth, window.innerHeight );

				this.vrManager = new WebVRManager(this.renderer, this.vrEffect, {hideButton: false});

				this.touchInputVector = new THREE.Vector3();

				this.colliders = [];

				var loader = new THREE.ObjectLoader();
				loader.setCrossOrigin('Anonymous');
				loader.load(assetsUrl + 'models/school/scene.json', function (obj) {

					me.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 100000 );

					me.vrControls = new THREE.VRControls( me.camera );


					// Setup a game controller for mobile
					// GameController.init( {
					// 	left: {
					//         type: 'none'
					//     },
					//     right: {
					//         type: 'joystick',
					//         joystick: {
					//         	radius: 50,
					// 			touchMove: function(moveInfo) {
				 //                    me.touchInputVector.x = moveInfo.normalizedX;
				 //                    me.touchInputVector.z = -moveInfo.normalizedY;
				 //                    me.touchInputVector.multiplyScalar(2);
				 //                    console.log(me.touchInputVector)
					//             }
					//         }
					//     }
					//     // right: {
					//     //     position: {
					//     //         right: '5%'
					//     //     },
					//     //     type: 'buttons',
					//     //     buttons: [
					//     //     {
					//     //         label: 'jump', fontSize: 13, touchStart: function() {
					//     //             // do something
					//     //         }
					//     //     },
					//     //     false, false, false
					//     //     ]
					//     // }
					// });

					document.addEventListener( 'touchstart', function () {
						console.log('touchstart');
						me.touchInputVector.set(0,0,-1)
					});

					document.addEventListener( 'touchend', function () {
						console.log('touchend');
						me.touchInputVector.set(0,0,0)
					});

					me.scene.add(obj);

					player = new THREE.Object3D();
					player.add(me.camera);
					me.scene.add( player );

					obj.traverse(function (child) {
						switch(child.userData.type) {
							case 'BoxCollider':
								var geometry = new THREE.BoxGeometry(child.userData.size[0]*child.parent.scale.x, child.userData.size[1]*child.parent.scale.y, child.userData.size[2]*child.parent.scale.z);

								// Bake the rotations as normals in collision reports are not rotated
					            var worldRot = child.parent.getWorldQuaternion();
				                _.each(geometry.vertices, function(vertex) {
							      	vertex.applyQuaternion(worldRot);
							    });

							    geometry.computeFaceNormals();

								var colliderMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
								me.colliders.push(colliderMesh);
								me.scene.add(colliderMesh);

								colliderMesh.visible = false;
								colliderMesh.position.copy(child.parent.position.clone().add((new THREE.Vector3()).fromArray(child.userData.center)));
								break;
						}

						if (!gameObjects[child.name]) {
							gameObjects[child.name] = child;
						}
					});

					if (gameObjects['PlayerStartHall']) {
						teleportPlayer(gameObjects['PlayerStartHall']);
					}

					Accounts.onLogin(function () {
						if (gameObjects['PlayerStartClass']) {
							teleportPlayer(gameObjects['PlayerStartClass']);
						}
					});

					Meteor.autorun(function () {
					  if (Meteor.userId()) {
						if (gameObjects['PlayerStartClass']) {
							teleportPlayer(gameObjects['PlayerStartClass']);
						}
					  } else {
						if (gameObjects['PlayerStartHall']) {
							teleportPlayer(gameObjects['PlayerStartHall']);
						}
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
				this.vrManager.render( this.scene, this.camera );
			};

			rootScene.prototype.update = function () {
				this.vrControls.update();

				if ( true ) {

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

	                inputVector.add(this.touchInputVector);

					inputVector.applyQuaternion(this.camera.quaternion);

					var velocity = new THREE.Vector3();
					velocity.add(inputVector);
					velocity.multiplyScalar(2);
					velocity.multiplyScalar(delta);
					velocity.y = 0;

					if (inputVector.lengthSq() > 0) {
						raycaster.set(player.position, velocity);

						var intersects = raycaster.intersectObjects( this.colliders );

			          	if ( intersects.length > 0 && intersects[0].distance < 0.5) {
				            var raycastNormal = intersects[0].face.normal;
				            var raycastGroundPosition = intersects[0].point;

				            var distanceInside = 0.5-intersects[0].distance;

				            var add = raycastNormal.clone().multiplyScalar(-velocity.clone().dot(raycastNormal));
				            velocity.add(add);
			          	}
					}

		            if (Keyboard.getKey(KEYS.SHIFT)) {
		                velocity.multiplyScalar(2);
		            }

					player.position.add(velocity);

					prevTime = time;
				}


				if (gameObjects['KioskLogin'] && gameObjects['KioskLogout']){
					var distVectorKioskLogin = gameObjects['KioskLogin'].position.clone().sub(player.position);
					var distVectorKioskLogout = gameObjects['KioskLogout'].position.clone().sub(player.position);

					if (distVectorKioskLogout.length() < 2.5) {
						if (!isNearbyKiosk) {
							Meteor.logout();
						}
						isNearbyKiosk = true;
					}
					else if (distVectorKioskLogin.length() < 2.5) {
						if (!isNearbyKiosk) {


						    var modalInstance = $modal.open({
						      animation: true,
						      templateUrl: 'client/modules/kiosk/kiosk.ng.html'
						    });

						    modalInstance.result.then(function (selectedItem) {

						    }, function () {

						    });

						}
						isNearbyKiosk = true;
					}
					else {
						isNearbyKiosk = false;
					}
				}

			};

			rootScene.prototype.resize = function () {
				if (this.camera) {
					this.camera.aspect = window.innerWidth / window.innerHeight;
					this.camera.updateProjectionMatrix();

					this.vrEffect.setSize( window.innerWidth, window.innerHeight );
				}
			}

			return new rootScene();
		}
	);
