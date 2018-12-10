

angular.module('streama').config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
});


angular.module('streama').factory('httpInterceptor', function ($rootScope, $q, localStorageService) {
  return {
    request: function (config) {
      if (localStorageService.get('currentProfile')){
        config.headers.profileId = localStorageService.get('currentProfile').id || 0;
      }
      return config || $q.when(config);
    }

  };
});
