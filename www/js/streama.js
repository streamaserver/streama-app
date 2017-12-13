// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in dash.controller.js
angular.module('streama', [
	//external libs
	'ionic', 'ionic.cloud', 'LocalStorageModule', 'ui.bootstrap',

	//streama modules
	'streama.setup', 'streama.core', 'streama.dash', 'streama.translations', 'streama.player', 'streama.videoPlayer'])


	.config(function($ionicCloudProvider, $httpProvider) {
		// $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
		$httpProvider.defaults.withCredentials = true;

		$ionicCloudProvider.init({
			"core": {
				"app_id": "485e5f3ff58323ecca1684e58b4e9eaabcc6d5e19e74b299"
			}
		});
	});
