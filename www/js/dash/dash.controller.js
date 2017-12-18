(function () {
'use strict';

  angular.module('streama.dash')
  .controller('DashCtrl', function(currentUser, apiService, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, $scope, mediaListService, $rootScope) {
    var vm = this;
    vm.openMediaDetail = openMediaDetail;
    $scope.$on('$stateChangeSuccess', onStateChangeSuccess);
    $rootScope.$watch('searchQuery', onSearch);
    init();


    function init() {
      $ionicSideMenuDelegate.canDragContent(false);
      vm.swiperOptions = initSwiperOptions();

      apiService.dash.listContinueWatching().then(function (response) {
        vm.continueWatchingList = response.data;
      });


      vm.show = mediaListService.init(apiService.dash.listShows, {sort: 'name', order: 'ASC'});
      vm.movie = mediaListService.init(apiService.dash.listMovies, {sort: 'title', order: 'ASC'});
      vm.genericVideo = mediaListService.init(apiService.dash.listGenericVideos, {sort: 'title', order: 'ASC'});

      apiService.dash.listNewReleases().then(function (response) {
        vm.newReleases = response.data;
      });
      apiService.dash.listRecommendations().then(function (response) {
        vm.recommendations = response.data;
      });
    }

    function onSearch(searchQuery) {
      if(searchQuery){
        vm.show.filter.name = searchQuery;
        vm.show.search();
        vm.movie.filter.title = searchQuery;
        vm.movie.search();
        vm.genericVideo.filter.title = searchQuery;
        vm.genericVideo.search();
      }
      console.log('%c onSearch', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', arguments);
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
}());
