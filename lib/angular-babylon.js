angular
	.module('babylon', [])
	.factory('BABYLON', [
		'$window',
		function($window) {
			'use strict';

			if (Meteor.isServer) {
				// Not yet available on the server
				return null;
			}

			return $window.BABYLON;
		}
	]);
