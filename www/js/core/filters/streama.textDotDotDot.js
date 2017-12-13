
angular.module('streama.core').filter('streamaTextDotDotDot', [function() {
	return function(input, length) {
		length = length || 255;
		if(!input){
		  return input;
    }
		if(input < length){
			return input;
		}else{
			return input.substring(0, length) + '...';
		}
	};
}]);
