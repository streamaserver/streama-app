angular.module('streama.dash')
.controller('MediaDetailCtrl', function($stateParams, apiService) {
	var vm = this;

	console.log('%c $stateParams', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', $stateParams);

	apiService.dash.mediaDetail({id: $stateParams.mediaId, mediaType: $stateParams.mediaType}).then(function (response) {
		vm.media = response.data;

		if($stateParams.mediaType == 'tvShow'){
			apiService.dash.listEpisodesForShow({id: $stateParams.mediaId}).then(function (episodes) {
				vm.seasons = _.groupBy(episodes.data, 'season_number');
				vm.currentSeason = _.min(Object.keys(vm.seasons));
			});
		}
	});
});

