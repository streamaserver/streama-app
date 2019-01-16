angular.module('streama').config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'templates/main.html',
    controller: 'mainCtrl as mainVm',
    resolve: {
      profiles: getProfiles,
      serverVersion: function (apiService, $rootScope) {
        var domain = apiService.setup.getDomain();
        return apiService.setup.getInfo(domain).then(function (response) {
          var serverVersion = response.data.streamaVersion;
          $rootScope.serverVersion = serverVersion;
          return serverVersion;
        }, function () {
          return {};
        });
      },
      genres: function (apiService) {
        return apiService.dash.listGenres().then(function (response) {
          return response.data;
        }, function () {
          return [];
        });
      }
    }
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

  .state('main.selectProfile', {
    url: '/selectProfile',
		resolve: {
      currentUser: currentUserResolve,
      profiles: getProfiles
		},
		views: {
			'content': {
				templateUrl: 'templates/dash/selectProfile.page.html',
				controller: 'SelectProfileCtrl as vm'
			}
		}
  })

  .state('main.dashGenre', {
    url: '/dashGenre/:genreId',
		resolve: {
			currentUser: currentUserResolve
		},
		views: {
			'content': {
				templateUrl: 'templates/dash/dash.genre.page.html',
				controller: 'DashGenreCtrl as vm'
			}
		}
  })

  .state('main.mediaDetail', {
    url: '/dash/:mediaType/:mediaId?isContinuing',
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

function getProfiles (apiService) {
  return apiService.profile.getUserProfiles().then( function (resp) {
    return resp.data;
  })
}
