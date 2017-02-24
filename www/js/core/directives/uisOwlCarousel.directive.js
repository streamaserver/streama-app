//= wrapped

angular
	.module('streama.core')
	.directive('uisOwlCarousel', function uisOwlCarousel($timeout) {
			var directive = {
				restrict: 'A',
				link: link
			};

			return directive;


			function link($scope, $elem, $attr) {
				var defaultOptions = {
					loop: true,
					items: 1,
					dots: true,
					autoplay: true,
					autoplaySpeed: 1000
				};
				var options = angular.merge(defaultOptions, $scope.$eval($attr.uisOptions));
				$timeout(function () {
					$($elem)
						.addClass('owl-carousel owl-theme')
						.owlCarousel(options);
				}, 10);
			}
		}
	);

