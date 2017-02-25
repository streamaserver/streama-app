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

  // .state('app.search', {
  //   url: '/search',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/search.html'
  //     }
  //   }
  // })

  // .state('app.browse', {
  //     url: '/browse',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'templates/browse.html'
  //       }
  //     }
  //   })
  //   .state('app.playlists', {
  //     url: '/playlists',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'templates/playlists.html',
  //         controller: 'PlaylistsCtrl'
  //       }
  //     }
  //   })
	//
  // .state('app.single', {
  //   url: '/playlists/:playlistId',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/playlist.html',
  //       controller: 'PlaylistCtrl'
  //     }
  //   }
  // });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/setup');
});


function currentUserResolve(apiService, $state) {
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
