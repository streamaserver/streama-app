angular.module('streama.core').controller('mainCtrl', function (localStorageService, profiles, apiService, genres, $state) {
  var mainVm = this;
  mainVm.profiles = profiles;
  mainVm.toggleSearch = toggleSearch;
  mainVm.setGenre = setGenre;
  mainVm.setProfile = setProfile;
  mainVm.genres = genres;
  mainVm.selectedGenre = null;

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
    localStorageService.set('currentProfile', profile);
    $state.go('main.dash',{},{reload:true})
  }
});
