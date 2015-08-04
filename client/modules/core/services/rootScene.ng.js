// serves as the "main" world for the game system
angular
	.module('vmp.core.root-scene', [
		'vmp.core.input.keyboard',
		'vmp.core.input.keys',
		'vmp.core.input.gameController',
		'vmp.core.pointerlockhandler',
		'physijs',

		'three',
	])
	.service('$rootScene',
		function(THREE, $q, $window, Keyboard, KEYS, Physijs, $modal, PointerLockHandler, assetsUrl, GameController) {

			var controlsEnabled = false;

			var prevTime = performance.now();
			var velocity = new THREE.Vector3();

			var gameObjects = {};
			var isNearbyKiosk = false;

			var player = null;

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

			var teleportPlayer = function (target) {
				player.position.copy(target.position);
				player.__dirtyPosition = true;

				// For now, rotations need to be hardcoded
				// as I'm unable to change the pointerlockcontrols rotation straight
				// from a matrix
				var yawObject = player.children[0];
				if (target.name === 'PlayerStartHall') {
					yawObject.rotation.y = Math.PI / 2;
				}
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

				var loader = new THREE.ObjectLoader();
				loader.setCrossOrigin('Anonymous');
				loader.load(assetsUrl + 'models/school/scene.json', function (obj) {

					me.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 100000 );

					me.vrControls = new THREE.VRControls( me.camera );


					// Setup a game controller for mobile
					GameController.init( {
						left: {
					        type: 'none'
					    },
					    right: {
					        type: 'joystick',
					        joystick: {
					        	radius: 50,
								touchMove: function(moveInfo) {
				                    me.touchInputVector.x = moveInfo.normalizedX;
				                    me.touchInputVector.z = -moveInfo.normalizedY;
				                    me.touchInputVector.multiplyScalar(2);
				                    console.log(me.touchInputVector)
					            }
					        }
					    }
					    // right: {
					    //     position: {
					    //         right: '5%'
					    //     },
					    //     type: 'buttons',
					    //     buttons: [
					    //     {
					    //         label: 'jump', fontSize: 13, touchStart: function() {
					    //             // do something
					    //         }
					    //     },
					    //     false, false, false
					    //     ]
					    // }
					});

					document.addEventListener( 'touchend', function () {
						console.log('touchend');
						me.touchInputVector.set(0,0,0)
					});

					// dae.updateMatrix();
					// // var physicsWorld = new Physijs.ConcaveMesh(dae.geometry, dae.material, 0);
					// // physicsWorld.position.copy(dae.position);
					me.scene.add(obj);

					var capsule_geometry = createCapsuleGeometry();
					// var material = new THREE.MeshLambertMaterial({ opacity: 0.8, transparent: true, color: 0xff0000 });
					var material = new THREE.MeshBasicMaterial();

					player = new Physijs.CapsuleMesh(
						capsule_geometry,
						material,
						10
					);
					player.add(me.camera);
					me.scene.add( player );

					// var light = new THREE.AmbientLight( 0xcccccc ); // soft white light
					// me.scene.add( light );

					player.setAngularFactor(new THREE.Vector3(0, 0, 0));
					// player.setLinearFactor(new THREE.Vector3(1, 0, 1));


					obj.traverse(function (child) {
						switch(child.userData.type) {
							case 'BoxCollider':
								var geometry = new THREE.BoxGeometry(child.userData.size[0]*child.parent.scale.x, child.userData.size[1]*child.parent.scale.y, child.userData.size[2]*child.parent.scale.z);
								var physicsMesh = new Physijs.BoxMesh(geometry, new THREE.MeshBasicMaterial(), 0);
								me.scene.add(physicsMesh);
								physicsMesh.position.copy(child.parent.position.clone().add((new THREE.Vector3()).fromArray(child.userData.center)));
								// physicsMesh.position.copy(child.parent.position.clone());
								physicsMesh.rotation.copy(child.parent.rotation);
								physicsMesh.__dirtyPosition = true;
								physicsMesh.__dirtyRotation = true;
								// console.log(child.position);

								child.visible = false;
								physicsMesh.visible = false;
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

				this.scene.simulate();
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

					player.applyCentralImpulse(inputVector);

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

							PointerLockHandler.disable();

						    var modalInstance = $modal.open({
						      animation: true,
						      templateUrl: 'client/modules/kiosk/kiosk.ng.html'
						      // controller: 'ModalInstanceCtrl',
						      // size: size,
						    });

						    modalInstance.result.then(function (selectedItem) {

						    }, function () {
						      // $log.info('Modal dismissed at: ' + new Date());
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
