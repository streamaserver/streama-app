angular.module('streama.dash')
.controller('DashCtrl', function(currentUser, apiService, $ionicSideMenuDelegate, $ionicScrollDelegate) {
	var vm = this;
	$ionicSideMenuDelegate.canDragContent(false);
	$ionicScrollDelegate.freezeAllScrolls(true);

	apiService.dash.listContinueWatching().then(function (response) {vm.continueWatchingList = response.data});
	apiService.dash.listShows().then(function (response) {vm.shows = response.data});
	apiService.dash.listMovies().then(function (response) {vm.movies = response.data});
	apiService.dash.listGenericVideos().then(function (response) {vm.genericVideos = response.data});
	apiService.dash.listNewReleases().then(function (response) {vm.newReleases = response.data;});
	apiService.dash.listRecommendations().then(function (response) {vm.recommendations = response.data;});


	vm.highlightCarouselOptions = {
		loop: false,
		items: 1,
		dots: true,
		autoplay: true,
		autoplaySpeed: 1000,
		random: function() {
			return 0.5 - Math.random();
		}
	};
	vm.carouselOptions = {
		loop: false,
		nav: false,
		margin:10,
		responsive:{
			0:{
				items:2
			},
			400:{
				items:3
			},
			600:{
				items:4
			},
			1000:{
				items:6
			},
			1300:{
				items:8
			}
		}
	}
});

