(function () {
'use strict';

  angular.module('streama.dash')
  .controller('DashCtrl', function(currentUser, apiService, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, $scope, mediaListService, $ionicNavBarDelegate, $timeout) {
    var vm = this;
    vm.openMediaDetail = openMediaDetail;
    $scope.$on('$stateChangeSuccess', onStateChangeSuccess);
    $scope.$watch('mainVm.searchQuery', onSearch);
    init();


    function init() {
      vm.isLoading = true;
      $ionicNavBarDelegate.showBackButton(false);
      $scope.mainVm.selectedGenre = null;
      $ionicSideMenuDelegate.canDragContent(false);
      vm.swiperOptions = mediaListService.initSwiperOptions();

      apiService.dash.listContinueWatching().then(function (response) {
        vm.continueWatchingList = response.data;
      });


      vm.show = mediaListService.init(apiService.dash.listShows, {sort: 'name', order: 'ASC'});
      vm.newestShow = mediaListService.init(apiService.dash.listShows, {sort: 'first_air_date', order: 'DESC'});
      vm.newestMovie = mediaListService.init(apiService.dash.listMovies, {sort: 'release_date', order: 'DESC'});
      vm.newestAddedShow = mediaListService.init(apiService.dash.listShows, {sort: 'dateCreated', order: 'DESC'});
      vm.newestAddedMovie = mediaListService.init(apiService.dash.listMovies, {sort: 'dateCreated', order: 'DESC'});
      vm.movie = mediaListService.init(apiService.dash.listMovies, {sort: 'title', order: 'ASC'});
      vm.genericVideo = mediaListService.init(apiService.dash.listGenericVideos, {sort: 'title', order: 'ASC'});

      apiService.dash.listNewReleases().then(function (response) {
        vm.newReleases = response.data;

        $timeout(function () {
          vm.isLoading = false;
        }, 1000);
      });
      apiService.dash.listRecommendations().then(function (response) {
        vm.recommendations = response.data;
      });
    }

    function onSearch(searchQuery, oldQuery) {
      if(searchQuery !== oldQuery){
        vm.show.filter.name = searchQuery;
        vm.show.search();
        vm.movie.filter.title = searchQuery;
        vm.movie.search();
        vm.genericVideo.filter.title = searchQuery;
        vm.genericVideo.search();
      }
    }

    function onStateChangeSuccess(e, toState) {
      if(toState.name === 'main.dash'){
        init();
      }
    }

    function openMediaDetail(media) {
      var options = { reload: false };
      $state.go('main.mediaDetail', {mediaId: media.id}, options);
    }

  });
}());
