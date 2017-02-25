/**
 * Created by antonia on 2017-02-23.
 */

angular.module('streama.core')
	.directive('streamaMediaItem', function () {
		return {
			restrict: 'AE',
			scope: {
				item: '='
			},
			templateUrl: 'templates/core/mediaItem.directive.html',
			link: function ($scope, $element, $attrs) {
				$scope.showDetails = showDetails;

				$scope.getPosterBackground = getPosterBackground;

				function getPosterBackground(item) {
					var imagePath = 'img/poster-not-found.png';
					var result = {};

					if(item.poster_path){
						imagePath =  'https://image.tmdb.org/t/p/w300/' + item.poster_path;
					}
					if(item.manualInput && item.poster_image_src){
						imagePath = item.poster_image_src;
					}
					if(!item.poster_path && !item.manualInput){
						imagePath = 'img/poster-not-found.png';
					}

					result.backgroundImage = 'url('+ imagePath +')';
					return result;
				}
				function showDetails() {
					console.log('%c showDetails', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
				}
			}
		}
	});
