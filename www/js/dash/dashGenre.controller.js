(function () {
'use strict';

  angular.module('streama.dash')
  .controller('DashGenreCtrl', function($stateParams, $rootScope, apiService, mediaListService, $ionicSideMenuDelegate, $scope) {
    var vm = this;
    vm.swiperOptions = mediaListService.initSwiperOptions();

    init();


    function init() {
      $ionicSideMenuDelegate.canDragContent(false);
      var genreId = parseInt($stateParams.genreId);
      $scope.mainVm.selectedGenre = _.find($scope.mainVm.genres, {id: genreId});

      vm.show = mediaListService.init(apiService.dash.listShows, {sort: 'name', order: 'ASC'}, {genreId: genreId});
      vm.movie = mediaListService.init(apiService.dash.listMovies, {sort: 'title', order: 'ASC'}, {genreId: genreId});
      vm.genericVideo = mediaListService.init(apiService.dash.listGenericVideos, {sort: 'title', order: 'ASC'}, {genreId: genreId});
    }

  });
}());
