(function(_) {
    'use strict';

    angular
        .module('underscore', [])
        .provider('_', function() {
            this.$get = function() {
            	// Provided by Meteor
                return _;
            };
        });
})(this._);
