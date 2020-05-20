(function() {
	'use strict';

	angular.module('MetricsPortal.pages').controller('slideShowCtrl',
			slideShowCtrl);

	/** @ngInject */
	
	

	function slideShowCtrl($scope, $state, buildData, baConfig,
			localStorageService, $filter, $element, $rootScope, $window,
			$sessionStorage, layoutPaths, $base64, $http, $timeout, $uibModal,Idle, Keepalive,$interval) {
		
		
		
		// Not to watch the Ideal state.
		Idle.unwatch();
		
		// Refresh the Page
		var timeinterval=0;
	    $interval(function() {timeinterval++;
                if(timeinterval===1000){
                 $state.reload();timeinterval=0;
                }},1000);

		function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);

			return tokeen;
		}
		
		
		
		$rootScope.displayDashName = localStorageService.get('dashboardName');
		$rootScope.loggedInuserId = localStorageService.get('loggedInuserId');
		
		
		
		
		$scope.onExit = function() {
		 	
			
			
			$rootScope.hidepagetop=false;
			window.top.location.href="/intelligentdashboard/#/dashboard"; //works OK
			window.top.close();
			window.opener.location.reload();
			
			
		    };
		    
		    var timer = setInterval(function () {
	            if ($scope.win.closed) {	
	            	$rootScope.hidepagetop=false;
	            	$rootScope.menubarPopup = true;
	                clearInterval(timer);
	                Idle.watch();
//	                $state.go('dashboard'); // Refresh the parent page
	                window.location = "/intelligentdashboard/#/dashboard";
//	                window.location.reload(); 
	            }
	        }, 1000);
		 
		

		$scope.openpopup = function(size) {
			
			
			$rootScope.hidepagetop=true;
			$rootScope.menubarPopup = false;
 			$scope.win = window.open("/intelligentdashboard/#/slideshowpopup", "popup",
					"width=1850,height=900,left=30,top=50");
			
	    }
		
		
		
		
		

		$scope.gotodashboard = function() {
			$state.go('dashboard');
		};
		
		$scope.reload = function () {
		      $timeout(function(){
		      $scope.reload();
		    },30000)
		  };
		

		// Carousal

		/*$scope.myInterval = 5000;
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
		                      "app/SlideShow/defectSlide13.html", "app/SlideShow/defectSlide14.html", "app/SlideShow/userStorySlide15.html",
		                      "app/SlideShow/userStorySlide16.html", "app/SlideShow/userStorySlide18.html"];
		   $scope.slidetxt = ["Requirements", "Requirements", "Requirements", "Design", "Design", "Design","Design","Execution","Execution","Execution",
		                      "Defects","Defects","Defects","Defects","User Story", "User Story", "User Story"] ;
		   
		    slides.push({
		    	image: $scope.slideimg[i],
		        text: $scope.slidetxt[i],
		        id: currIndex++
		    });
		  };

		  for (var i = 0; i < 14; i++) {
		    $scope.addSlide(i);
		  }*/

		$scope.myInterval = 5000;
		$scope.myPopupInterval = 5000;
		$scope.noWrapSlides = false;
		$scope.noPopupWrapSlides = false;
		$scope.active = 0;
		$scope.popupactive = 0;
		var slides = $scope.slides = [];
		var popupslides = $scope.popupslides = [];
		var currIndex = 0;
		var currPopupIndex = 0;

		$scope.addPopUpSlide = function(i) {
			var newPopupWidth = 600 + popupslides.length + 1;
			$scope.popupslideimg = [ "app/SlideShow/popupAllSlides.html"
					 ];
			$scope.popupslidetxt = [ "Requirements", "Design", "Execution",
					"Defects" ];

			popupslides.push({
				image : $scope.popupslideimg[i],
				text : $scope.popupslidetxt[i],
				id : currPopupIndex++
			});
		};

		for (var i = 0; i < 1; i++) {
			$scope.addPopUpSlide(i);
		}

		$scope.addSlide = function(i) {
			var newWidth = 600 + slides.length + 1;
			$scope.slideimg = [ "app/SlideShow/reqSlide1.html",
					"app/SlideShow/reqSlide2.html",
					"app/SlideShow/reqSlide3.html",
					"app/SlideShow/designSlide4.html",
					"app/SlideShow/designSlide5.html",
					"app/SlideShow/designSlide6.html",
					"app/SlideShow/designSlide7.html",
					"app/SlideShow/exeSlide8.html",
					"app/SlideShow/exeSlide9.html",
					"app/SlideShow/exeSlide10.html",
					"app/SlideShow/defectSlide11.html",
					"app/SlideShow/defectSlide12.html",
					"app/SlideShow/defectSlide13.html",
					"app/SlideShow/defectSlide14.html"/*, "app/SlideShow/userStorySlide15.html",
								                      "app/SlideShow/userStorySlide16.html", "app/SlideShow/userStorySlide18.html"*/];
			$scope.slidetxt = [ "Requirements", "Requirements", "Requirements",
					"Design", "Design", "Design", "Design", "Execution",
					"Execution", "Execution", "Defects", "Defects", "Defects",
					"Defects"/*,"User Story", "User Story", "User Story"*/];

			slides.push({
				image : $scope.slideimg[i],
				text : $scope.slidetxt[i],
				id : currIndex++
			});
		};

		for (var i = 0; i < 14; i++) {
			$scope.addSlide(i);
		}

	}
	
	
	
	
	

})();
