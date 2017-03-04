'use strict';

angular.module('streama.player').controller('PlayerCtrl', [
	'$scope', 'apiService', '$stateParams', 'playerService', '$rootScope',
	function ($scope, apiService, $stateParams, playerService, $rootScope) {

		apiService.player.video($stateParams.videoId).success(function (data) {
			$scope.video = data;

			var missingFileError = playerService.handleMissingFileError($scope.video);
			var wrongBasePathError = playerService.handleWrongBasepathError($scope.video);

			if(!missingFileError && !wrongBasePathError){
				$scope.videoOptions = playerService.setVideoOptions($scope.video);
			}

			playerService.registerSocketListener();

		});

		$rootScope.$on('$stateChangeStart', function(e, toState){
			if(toState.name != 'player'){
				playerService.destroyPlayer();
			}
		});

		$scope.$on('playerSession', function (e, data) {
			playerService.handleSocketEvent(data);
		});
	}]);
