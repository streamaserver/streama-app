angular.module('streama.setup')
.controller('SetupCtrl', function($scope, $timeout) {
	var vm = this;
	vm.slider;
	vm.setup = {};
	vm.isAuthorizationEnabled = false;

	vm.proceedToSlide = proceedToSlide;
	vm.toggleHelp = toggleHelp;
	vm.validateDomain = validateDomain;
	vm.login = login;

	$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
		vm.slider = data.slider; // grab an instance of the slider
	});


	function toggleHelp(page) {
		console.log('%c toggleHelp', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', page);
		if(page == 'domain'){
			vm.helpForDomain = !vm.helpForDomain;
		}
	}

	function proceedToSlide(slideIndex) {
		vm.slider.slideTo(slideIndex);
	}

	function validateDomain(domain) {
		vm.isAuthorizationEnabled = true;
		$timeout(function () {
			vm.slider.slideTo(2);
		}, 100);
	}

	function login() {
		vm.loading = true;
	}
});
