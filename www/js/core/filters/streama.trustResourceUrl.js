angular.module('streama.core').filter('trustResourceUrl', ['$sce', function($sce) {
	return function(input) {
		return $sce.trustAsResourceUrl(input);
	};
}]);
