angular
	.module('physijs', [])
	.factory('Physijs', [
		'$window',
		function($window) {
			'use strict';

		    $window.Physijs.scripts.worker = '/scripts/physijs_worker.js';
		    $window.Physijs.scripts.ammo = '/scripts/ammo.js';				

			return $window.Physijs;
		}
	]);
