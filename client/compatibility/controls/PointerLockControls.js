/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var me = this;

	me.yawObject = new THREE.Object3D();
	// me.yawObject.position.y = 10;
	me.yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		// me.yawObject.rotateY(-movementX * 0.002);
		// pitchObject.rotateX(-movementY * 0.002);
		me.yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	document.addEventListener( 'mousemove', onMouseMove, false );

	this.enabled = false;

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, me.yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.rotateVec = function() {
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
		return function( v ) {
			rotation.set( pitchObject.rotation.x, me.yawObject.rotation.y, 0 );
			v.applyEuler( rotation );
			return v;
		}

	}();


};
