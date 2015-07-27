angular
	.module('vmp.core.physics', [
		'three',
		'physijs'
	])
	.service('PhysicsWorld',
		function (THREE, Physijs, $rootScene) {
			'use strict';

		    Physijs.scripts.worker = '/scripts/physijs_worker.js';
		    Physijs.scripts.ammo = '/scripts/ammo.js';			

		}
	);
