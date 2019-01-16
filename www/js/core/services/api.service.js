angular.module('streama.core')
	.service('apiService', function ($http, localStorageService, $q) {
		var basePath = localStorageService.get('streamaDomain');
		var apiBase = 'api/v1/';
		var genres = null;

		return{

			getBasePath: function () {
				return basePath;
			},
			setBasePath: function (_basePath) {
        basePath = _basePath;
			},

			core: {
				login: function (data) {
					return $http({
						method: 'POST',
						url: basePath + 'login/authenticate',
						// url: basePath + 'api/v1/validateDomain',
						headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With' :'XMLHttpRequest'},
						transformRequest: _.objectToParams,
						data: data
					});
				},
				logout: function () {
					var deferred = $q.defer();
					$http.post(basePath + 'logoff').then(onLogoff, onLogoff);

					function onLogoff() {
						$http.get(basePath + apiBase + 'currentUser').then(function (data) {
							if(!_.get(data, 'id')){
								deferred.resolve();
							}
						})
					}

					return deferred.promise;
				},
				currentUser: function () {
					return $http.get(basePath + apiBase + 'currentUser');
				}
			},


			setup: {
				getInfo: function (domain) {
					return $http.get(domain + apiBase + 'getInfo');
				},
				validateDomain: function (domain) {
					return $http.get(domain + apiBase + 'validateDomain');
				},
				saveDomain: function (domain) {
					localStorageService.set('streamaDomain', domain);
					basePath = domain;
				},
				getDomain: function () {
					return localStorageService.get('streamaDomain');
				}
			},




			dash: {
				listContinueWatching: function () {
					return $http.get(basePath + apiBase + 'dash/listContinueWatching');
				},
				listShows: function (params) {
					return $http.get(basePath + apiBase + 'dash/listShows', {params: params});
				},
				listMovies: function (params) {
					return $http.get(basePath + apiBase + 'dash/listMovies', {params: params});
				},
				listGenericVideos: function (params) {
					return $http.get(basePath + apiBase + 'dash/listGenericVideos', {params: params});
				},
				listNewReleases: function (params) {
					return $http.get(basePath + apiBase + 'dash/listNewReleases');
				},
				listRecommendations: function (params) {
					return $http.get(basePath + apiBase + 'dash/listRecommendations');
				},
				mediaDetail: function (params) {
					return $http.get(basePath + apiBase + 'dash/mediaDetail', {params: params});
				},
				listEpisodesForShow: function (params) {
					return $http.get(basePath + apiBase + 'dash/listEpisodesForShow', {params: params});
				},
				cotinueWatching: function (params) {
					return $http.get(basePath + apiBase + 'dash/cotinueWatching', {params: params});
				},
        markAsCompleted: function (params) {
					return $http.get(basePath + apiBase + 'dash/markAsCompleted', {params: params});
				},
        listGenres: function (params) {
				  if(!genres){
            return $http.get(basePath + apiBase + 'dash/listGenres', {params: params});
          }
          else{
            var deferred = $q.defer();
            if(genres){
              deferred.resolve(genres);
            }
            return deferred.promise;
          }

				}
			},



			player: {
				video: function (videoId) {
					return $http.get(basePath + apiBase + 'player/video/' + videoId);
				},
				updateViewingStatus: function (params) {
					return $http.get(basePath + apiBase + 'player/updateViewingStatus', {
					  params: params
          });
				}
			},

      profile: {
        getUserProfiles: function () {
          return $http.get(basePath +  'profile/getUserProfiles.json');
        }
      }
		};
});
