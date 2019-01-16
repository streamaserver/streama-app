(function () {
  'use strict';

  angular.module('streama.dash')
    .controller('SelectProfileCtrl', function(profiles, localStorageService, $state, $ionicNavBarDelegate) {
      var vm = this;

      vm.profiles = profiles;
      vm.setCurrentProfile = setCurrentProfile;

      init();

      function init() {
        $ionicNavBarDelegate.showBackButton(false);
      }
      
      function setCurrentProfile(profile) {
        localStorageService.set('currentProfile', profile);
        $state.go('main.dash');
      }

    });
}());
