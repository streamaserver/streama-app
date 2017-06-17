angular.module('streama').config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'templates/main.html'
  })

  .state('setup', {
    url: '/setup',
    controller: 'SetupCtrl as vm',
		templateUrl: 'templates/setup/setup.page.html',
    resolve: {
      currentUser: currentUserReject
    }
  })

  .state('main.dash', {
    url: '/dash',
		resolve: {
			currentUser: currentUserResolve
		},
		views: {
			'content': {
				templateUrl: 'templates/dash/dash.page.html',
				controller: 'DashCtrl as vm'
			}
		}
  })

  .state('main.mediaDetail', {
    url: '/dash/:mediaType/:mediaId',
		resolve: {
			currentUser: currentUserResolve
		},
		views: {
			'content': {
				templateUrl: 'templates/dash/dash.mediaDetail.page.html',
				controller: 'MediaDetailCtrl as vm'
			}
		}
  })

  .state('player', {
    url: '/player/:videoId',
		// resolve: {
		// 	currentUser: currentUserResolve
		// },
		cache: false,
		templateUrl: 'templates/player/player.page.html',
		controller: 'PlayerCtrl as vm'
  })

  $urlRouterProvider.otherwise('/setup');
});


function currentUserResolve(apiService, $state) {
	console.log('%c currentUserResolve for ' + $state.current.name, 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
  return apiService.core.currentUser().then(function (response) {
    if(!response.data.id){
      $state.go('setup');
    }else{
      return response.data;
    }
  }, function (err) {
		if(err.status == 500){
			toastr.error('An internal Server-Error occured.');
		}
	})
}

function currentUserReject(apiService, $state) {
  return apiService.core.currentUser().then(function (response) {
    if(response.data.id){
      $state.go('main.dash');
    }else{
      return;
    }
  }, function (err) {
		if(err.status == 500){
			toastr.error('An internal Server-Error occured.');
		}
	})
}
