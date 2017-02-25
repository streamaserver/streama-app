angular.module('streama.setup')
.controller('SetupCtrl', function($scope, $timeout, $ionicLoading, apiService, $ionicPopup, $state) {
	var vm = this;
	vm.slider;
	vm.setup = {
		domain: apiService.setup.getDomain()
	};
	vm.isAuthorizationEnabled = false;
	vm.sliderOptions = {
		onlyExternal: true
	};

	vm.proceedToSlide = proceedToSlide;
	vm.toggleHelp = toggleHelp;
	vm.validateDomain = validateDomain;
	vm.login = login;
	init();




	function init() {
		if (vm.setup.domain) {
			vm.isAlreadySetUp = true;
		}

		$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
			vm.slider = data.slider; // grab an instance of the slider

			if(vm.isAlreadySetUp){
				proceedToSlide(2);
			}
		});
	}


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

		if(!_.endsWith(domain, '/')){
			domain += '/';
		}

		$ionicLoading.show({
			template: 'Validating Domain... <br><br> <ion-spinner></ion-spinner>'
		});

		apiService.setup.validateDomain(domain).then(function (response) {

			if(response.data.accessGranted){
				$ionicLoading.hide();
				vm.slider.slideTo(2);
				vm.setup.domain = domain;
				apiService.setup.saveDomain(domain);
			}
		}, function (err) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Oops...',
				template: 'Something seems to be wrong. Make sure you entered the right domain and that the server is up & running!'
			});
		});
	}

	function login() {
		$ionicLoading.show({template: 'Logging in... <br><br> <ion-spinner></ion-spinner>'});
		var payload = {
			username: vm.setup.username,
			password: vm.setup.password,
			'remember-me': true
		};

		apiService.core.login(payload).then(afterLogin, onLoginErr);



		function afterLogin() {
			apiService.core.currentUser().then(function (response) {
				console.log('%c currentUser data', JSON.stringify(response.data));
				if(!response.data.id){
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: 'Login failed',
						template: 'You did not login successfully using the above credentials. Please try again.'
					});
					return;
				}
				$ionicLoading.hide();
				$state.go('main.dash');
			});
		}

		function onLoginErr(err) {
			console.log('%c arguments', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', arguments);
			if(err.status == -1){
				afterLogin();
			}else{
				$ionicLoading.hide();
				toastr.error('error logging in. Please try again or try a different base path.')
			}

		}


	}
});
