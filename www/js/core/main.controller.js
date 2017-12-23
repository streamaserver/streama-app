angular.module('streama.core').controller('mainCtrl', function (apiService, genres, $state) {
  var mainVm = this;

  mainVm.toggleSearch = toggleSearch;
  mainVm.setGenre = setGenre;
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
});
