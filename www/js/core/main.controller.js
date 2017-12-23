angular.module('streama.core').controller('mainCtrl', function (apiService) {
  var mainVm = this;

  mainVm.toggleSearch = toggleSearch;

  function toggleSearch() {
    mainVm.searchQuery = '';
    mainVm.isSearchActive = !mainVm.isSearchActive;

    if(mainVm.isSearchActive){
      setTimeout(function () {
        $('.dashboard-search-box input').focus();
      }, 200);
    }
  }
});
