angular.module('streama.core')
	.service('apiService', function ($http, localStorageService, $q) {
		var basePath = localStorageService.get('streamaDomain');
		var apiBase = 'api/v1/';
		return{

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
				validateDomain: function (domain) {
					if(!_.endsWith(domain, '/')){
						domain += '/'
					}
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
					return $http.get(basePath + apiBase + 'dash/listShows');
				},
				listMovies: function (params) {
					return $http.get(basePath + apiBase + 'dash/listMovies');
				},
				listGenericVideos: function (params) {
					return $http.get(basePath + apiBase + 'dash/listGenericVideos');
				},
				listNewReleases: function (params) {
					return $http.get(basePath + apiBase + 'dash/listNewReleases');
				},
				listRecommendations: function (params) {
					return $http.get(basePath + apiBase + 'dash/listRecommendations');
				}
			}
		}
});