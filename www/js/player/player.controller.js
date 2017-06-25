'use strict';

angular.module('streama.player').controller('PlayerCtrl', [
	'$scope', 'apiService', '$stateParams', 'playerService', '$rootScope',
	function ($scope, apiService, $stateParams, playerService, $rootScope) {
		var vm = this;
		console.log('%c init streama player ctrl', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');

		apiService.player.video($stateParams.videoId).success(function (data) {
			vm.video = data;

			// var missingFileError = playerService.handleMissingFileError(vm.video);
			// var wrongBasePathError = playerService.handleWrongBasepathError(vm.video);

			if(data.mediaType === 'episode' && data.show){
				apiService.dash.listEpisodesForShow({id: data.show.id}).success(function (episodes) {
					vm.videoOptions = playerService.setVideoOptions(vm.video, episodes);
				});
			}else{
				vm.videoOptions = playerService.setVideoOptions(vm.video);
			}

			playerService.registerSocketListener();

		});

		$rootScope.$on('$stateChangeStart', function(e, toState){
			if(toState.name !== 'player'){
				playerService.destroyPlayer();
			}
		});

		$scope.$on('playerSession', function (e, data) {
			playerService.handleSocketEvent(data);
		});
	}]);
