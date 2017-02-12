angular.module('streama.core')
	.service('apiService', function ($http, localStorageService) {
		var basePath = localStorageService.get('streamaDomain');
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
					return $http.post(basePath + 'logoff');
				},
				currentUser: function () {
					return $http.get(basePath + 'api/v1/currentUser');
				}
			},
			setup: {
				validateDomain: function (domain) {
					return $http.get(domain + '/api/v1/validateDomain');
				},
				saveDomain: function (domain) {
					localStorageService.set('streamaDomain', domain);
					basePath = domain;
				},
				getDomain: function () {
					return localStorageService.get('streamaDomain');
				}
			}
		}
});