angular.module('streama.core').filter('streamaPadnumber', [function () {
	return function(input, length) {
		return pad(input, length);
	};
}]);