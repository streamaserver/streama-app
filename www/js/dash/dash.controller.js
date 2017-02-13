angular.module('streama.dash')
.controller('DashCtrl', function(currentUser, apiService) {
	var vm = this;
	console.log('%c currentUser', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', currentUser);

	apiService.dash.listContinueWatching().then(function (response) {vm.continueWatchingList = response.data});
	apiService.dash.listShows().then(function (response) {vm.shows = response.data});
	apiService.dash.listMovies().then(function (response) {vm.movies = response.data});
	apiService.dash.listGenericVideos().then(function (response) {vm.genericVideos = response.data});

	vm.carouselOptions = {
		loop: true,
		nav: false
	}
});
