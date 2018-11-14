angular.module('streama.core').controller('mainCtrl', function (localStorageService, profiles, apiService, genres, $state) {
  var mainVm = this;
  mainVm.profiles = profiles;
  mainVm.toggleSearch = toggleSearch;
  mainVm.setGenre = setGenre;
  mainVm.setProfile = setProfile;
  mainVm.goToManageProfiles = goToManageProfiles;
  mainVm.genres = genres;
  mainVm.selectedGenre = null;
  mainVm.selectedProfile = null;
  if(!localStorageService.get('currentProfile')) {
    localStorageService.set('currentProfile', profiles[0]);
  }
  mainVm.selectedProfile = localStorageService.get('currentProfile') || {};

  function toggleSearch() {
    mainVm.searchQuery = '';
    mainVm.isSearchActive = !mainVm.isSearchActive;

    if(mainVm.isSearchActive){
      setTimeout(function () {
        $('.dashboard-search-box input').focus();
      }, 200);
    }
  }

  function setGenre(genre) {
    $state.go('main.dashGenre', {genreId: genre.id});
  }

  function setProfile(profile) {
    mainVm.selectedProfile = profile;
    localStorageService.set('currentProfile', profile);
    $state.go('main.dash',{},{reload:true})
  }

  function goToManageProfiles() {
    window.open(localStorageService.get('streamaDomain') + '#/sub-profiles', '_system')
  }
});
