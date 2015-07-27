
angular.module('vmp', [
	'vmp.router',
	'vmp.landing',
	'vmp.render',
	'vmp.ui',

	'snap',
	'ui.bootstrap'
])
.run(function(snapRemote) {
	// Disable sliding events
	snapRemote.disable();
})
.run(function () {


})
;


function onReady() {
	angular.bootstrap(document, ['vmp']);
}

angular.element(document).ready(onReady);
