angular.module('streama.dash')
.controller('DashCtrl', function(currentUser, apiService, $ionicSideMenuDelegate, $ionicScrollDelegate, $state) {
	var vm = this;
	vm.openMediaDetail = openMediaDetail;
	init();


	function init() {
		$ionicSideMenuDelegate.canDragContent(false);
		$ionicScrollDelegate.freezeAllScrolls(true);
		vm.swiperOptions = initSwiperOptions();

		apiService.dash.listContinueWatching().then(function (response) {
			vm.continueWatchingList = response.data
		});
		apiService.dash.listShows().then(function (response) {
			vm.shows = response.data
		});
		apiService.dash.listMovies().then(function (response) {
			vm.movies = response.data
		});
		apiService.dash.listGenericVideos().then(function (response) {
			vm.genericVideos = response.data
		});
		apiService.dash.listNewReleases().then(function (response) {
			vm.newReleases = response.data;
		});
		apiService.dash.listRecommendations().then(function (response) {
			vm.recommendations = response.data;
		});
	}

	function openMediaDetail(media) {
		var options = { reload: false };
		$state.go('main.mediaDetail', {mediaId: media.id}, options);
	}

	function initSwiperOptions() {
		return {
			pagination: '.swiper-pagination',
			slidesPerView: 'auto',
			paginationClickable: true,
			spaceBetween: 8,
			freeMode: true
		};
	}

});

