/**
 * Created by antonia on 2017-02-23.
 */

angular.module('streama.core')
	.directive('streamaMediaContinueWatchingItem', function ($rootScope) {
		return {
			restrict: 'AE',
			scope: {
				item: '='
			},
			templateUrl: 'templates/core/mediaContinueWatchingItem.directive.html',
			link: function ($scope, $element, $attrs) {
				$scope.showDetails = showDetails;
				$scope.playMedia = playMedia;
        $scope.getImage = getImage;


        function getImage(item) {
          var imagePath = 'img/poster-not-found.png';
          var result = {};

          // if(item.backdrop_image_src){
          //   imagePath =  $rootScope.serverBasePath + item.backdrop_image_src;
          // }
          if(item.poster_image_src){
            imagePath =  $rootScope.serverBasePath + item.poster_image_src;
          }

          // else if(item.backdrop_path){
          //   imagePath =  'https://image.tmdb.org/t/p/w300/' + item.backdrop_path;
          // }

          else if(item.poster_path){
            imagePath =  'https://image.tmdb.org/t/p/w300/' + item.poster_path;
          }

          result.backgroundImage = 'url('+ imagePath +')';
          return result;
        }

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
