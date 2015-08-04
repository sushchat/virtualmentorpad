angular.module('vmp.core.input.gameController', [])
    .factory('GameController', [
        '$window',
        function($window) {
            'use strict';

            if (Meteor.isServer) {
                return null;
            }

            return $window.GameController;
        }
    ])