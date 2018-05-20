angular.module('streama.dash')
.controller('MediaDetailCtrl', function($stateParams, apiService, $state, $rootScope) {
	var vm = this;
	console.log('%c $stateParams', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', $stateParams);

	vm.continueWatching = continueWatching;
	vm.setCurrentSeason = setCurrentSeason;
	vm.markAsCompleted = markAsCompleted;
	vm.isContinuing = $stateParams.isContinuing;


	function continueWatching() {
		if($stateParams.mediaType === 'tvShow'){
			apiService.dash.cotinueWatching({id: $stateParams.mediaId}).then(function (response) {
				var videoInstance = response.data;
				console.log('%c videoInstance', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', videoInstance);
				$state.go('player', {videoId: videoInstance.id});
			});
		}else{
			$state.go('player', {videoId: $stateParams.mediaId});
		}
	}

	function markAsCompleted() {
    apiService.dash.markAsCompleted({id: $stateParams.mediaId}).then(function () {
      $state.go('main.dash');
    });
  }

	function setCurrentSeason(season) {
    vm.currentSeason = season;
  }


	apiService.dash.mediaDetail({id: $stateParams.mediaId, mediaType: $stateParams.mediaType}).then(function (response) {
		vm.media = response.data;

		if($stateParams.mediaType === 'tvShow' || $stateParams.mediaType === 'episode'){
      var tvShowId = $stateParams.mediaType === 'tvShow' ? $stateParams.mediaId : vm.media.tvShow.id;
			apiService.dash.listEpisodesForShow({id: tvShowId}).then(function (episodes) {
				vm.seasons = _.groupBy(episodes.data, 'season_number');
				vm.currentSeason = _.min(Object.keys(vm.seasons));
			});
		}
	});
});

