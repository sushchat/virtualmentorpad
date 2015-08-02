angular
	.module('vmp.core.physics', [
		'three',
		'physijs'
	])
	.run(function (Physijs, $rootScene, assetsUrl) {
			'use strict';

		    Physijs.scripts.worker = '/scripts/physijs_worker.js';
		    Physijs.scripts.ammo = '/scripts/ammo.js';

		}
	);