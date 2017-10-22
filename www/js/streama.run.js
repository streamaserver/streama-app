angular.module('streama')
  .run(function($ionicPlatform, $rootScope, apiService, $state) {

		$rootScope.logout = logout;
		$rootScope.toggleSearch = toggleSearch;
    $ionicPlatform.ready(onPlatformReady);
		$rootScope.navLogo = '<img class="title-image" src="img/logo.png" />';


		function onPlatformReady() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);

			}
			if (window.StatusBar) {
				StatusBar.hide();
			}
		}

		function logout() {
			apiService.core.logout().then(function () {
				$state.go('setup');
			});
		}

		function toggleSearch() {
      $rootScope.searchQuery = '';
      $rootScope.isSearchActive = !$rootScope.isSearchActive;

		  if($rootScope.isSearchActive){
		    setTimeout(function () {
          $('.dashboard-search-box input').focus();
        }, 200);
      }

		}
  });
