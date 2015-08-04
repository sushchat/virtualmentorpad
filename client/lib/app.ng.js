
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
.constant('assetsUrl', (function () {
	return ['localhost', '192.168.0.100'].indexOf(location.hostname) !== -1 ? 'http://' + location.hostname + ':8000/' : 'http://vmp.nickjanssen.com/'
})())
.run(function () {


})
;


function onReady() {
	angular.bootstrap(document, ['vmp']);
}

angular.element(document).ready(onReady);
