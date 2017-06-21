angular.module('streama.dash')
.controller('MediaDetailCtrl', function($stateParams, apiService, $state) {
	var vm = this;
	console.log('%c $stateParams', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', $stateParams);

	vm.continueWatching = continueWatching;
	
	
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


	apiService.dash.mediaDetail({id: $stateParams.mediaId, mediaType: $stateParams.mediaType}).then(function (response) {
		vm.media = response.data;

		if($stateParams.mediaType === 'tvShow'){
			apiService.dash.listEpisodesForShow({id: $stateParams.mediaId}).then(function (episodes) {
				vm.seasons = _.groupBy(episodes.data, 'season_number');
				vm.currentSeason = _.min(Object.keys(vm.seasons));
			});
		}
	});
});

