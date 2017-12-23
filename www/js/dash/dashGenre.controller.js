(function () {
'use strict';

  angular.module('streama.dash')
  .controller('DashGenreCtrl', function($stateParams, $rootScope, apiService, mediaListService, $ionicSideMenuDelegate, $scope) {
    var vm = this;

    init();


    function init() {
      $ionicSideMenuDelegate.canDragContent(false);
      $scope.mainVm.selectedGenre = _.find($scope.mainVm.genres, {id: parseInt($stateParams.genreId)});

      // vm.show = mediaListService.init(apiService.dash.listShows, {sort: 'name', order: 'ASC'});
      // vm.movie = mediaListService.init(apiService.dash.listMovies, {sort: 'title', order: 'ASC'});
      vm.genericVideo = mediaListService.init(apiService.dash.listGenericVideos, {sort: 'title', order: 'ASC'});
    }

  });
}());
