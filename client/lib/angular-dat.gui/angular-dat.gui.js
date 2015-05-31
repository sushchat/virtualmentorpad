angular
	.module('dat.gui', [])
	.factory('dat', [
		'$window',
		function($window) {
			'use strict';

			return $window.dat;
		}
	]);
