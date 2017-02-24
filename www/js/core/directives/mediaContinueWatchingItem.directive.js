/**
 * Created by antonia on 2017-02-23.
 */

angular.module('streama.core')
	.directive('streamaMediaContinueWatchingItem', function () {
		return {
			restrict: 'AE',
			scope: {
				item: '='
			},
			templateUrl: 'templates/core/mediaContinueWatchingItem.directive.html',
			link: function ($scope, $element, $attrs) {
				console.log('%c called link mediaContinueWatchingItem', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
			}
		}
	});
