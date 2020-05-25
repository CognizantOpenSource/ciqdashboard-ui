(function() {
	'use strict';

	angular.module('MetricsPortal.SlideShow').controller('slideShowCtrl',
			slideShowCtrl);

	/** @ngInject */

	function slideShowCtrl($scope, AES, $state, buildData, baConfig,
			localStorageService, $filter, $element, $rootScope,
			$sessionStorage, layoutPaths, $base64, $http, $timeout, $uibModal) {
		
		$rootScope.Mslide = true;

		function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);

			return tokeen;
		}
	//	setTimeout(function() { window.location.reload(true); }, 900000);
		$rootScope.displayDashName = localStorageService.get('dashboardName');
		$rootScope.loggedInuserId = localStorageService.get('loggedInuserId');
		$rootScope.menubar = false;
		
		
		// Carousal
		
		
		$scope.myInterval = 5000;
		  $scope.noWrapSlides = false;
		  $scope.active = 0;
		  var slides = $scope.slides = [];
		  var currIndex = 0;

		  $scope.addSlide = function(i) {
		   var newWidth = 600 + slides.length + 1;
		   $scope.slideimg = ["app/SlideShow/reqSlide1.html", "app/SlideShow/reqSlide2.html", "app/SlideShow/reqSlide3.html",
		                      "app/SlideShow/designSlide4.html", "app/SlideShow/designSlide5.html", "app/SlideShow/designSlide6.html",
		                      "app/SlideShow/designSlide7.html", "app/SlideShow/exeSlide8.html", "app/SlideShow/exeSlide9.html",
		                      "app/SlideShow/exeSlide10.html", "app/SlideShow/defectSlide11.html", "app/SlideShow/defectSlide12.html",
		                      "app/SlideShow/defectSlide13.html", "app/SlideShow/defectSlide14.html"/*, "app/SlideShow/userStorySlide15.html",
		                      "app/SlideShow/userStorySlide16.html", "app/SlideShow/userStorySlide18.html"*/];
		   $scope.slidetxt = ["Requirements", "Requirements", "Requirements", "Design", "Design", "Design","Design","Execution","Execution","Execution",
		                      "Defects","Defects","Defects","Defects"/*,"User Story", "User Story", "User Story"*/] ;
		   
		    slides.push({
		    	image: $scope.slideimg[i],
		        text: $scope.slidetxt[i],
		        id: currIndex++
		    });
		  };

		  for (var i = 0; i < 14; i++) {
		    $scope.addSlide(i);
		  }

	}

})();
