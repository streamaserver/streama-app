// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in dash.controller.js
angular.module('streama', [
	//external libs
	'ionic', 'ionic.cloud', 'LocalStorageModule',

	//streama modules
	'streama.setup', 'streama.core', 'streama.dash', 'angular-owl-carousel', 'streama.translations'])

  .run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }


			$rootScope.navLogo = '<img class="title-image" src="img/logo.png" />';
    });
  })


	.config(function($ionicCloudProvider, $httpProvider) {
		// $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
		$httpProvider.defaults.withCredentials = true;

		$ionicCloudProvider.init({
			"core": {
				"app_id": "485e5f3ff58323ecca1684e58b4e9eaabcc6d5e19e74b299"
			}
		});
	});
