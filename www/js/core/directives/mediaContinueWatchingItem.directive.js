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
				$scope.showDetails = showDetails;
				$scope.playMedia = playMedia;


				function showDetails(e) {
					console.log('%c showDetails', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
					e.stopPropagation();
				}
				function playMedia(e, item) {
					console.log('%c playMedia', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
				}

			}
		}
	});
