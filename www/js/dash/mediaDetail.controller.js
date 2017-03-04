angular.module('streama.dash')
.controller('MediaDetailCtrl', function($stateParams, apiService) {
	var vm = this;

	console.log('%c $stateParams', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', $stateParams);

	apiService.dash.mediaDetail({id: $stateParams.mediaId, mediaType: $stateParams.mediaType}).then(function (response) {
		vm.media = response.data;
	})
});

