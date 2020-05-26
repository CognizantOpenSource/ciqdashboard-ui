(function() {
	'use strict';

angular.module('MetricsPortal.Login').controller(
			'RegCtrl', RegCtrl);
/** @ngInject */
function RegCtrl($scope,$base64, $rootScope, $window, localStorageService, reCAPTCHA, $location,$http,$state,toastr) {
	
	
	
	reCAPTCHA.setPublicKey('6LeCi2MUAAAAACmT5vTmbuACR24AVyXO5oWpy3AR');

	 $scope.signUpUser = function(form) {

	   	    $scope.userid=form.suserId;
	   	    $scope.password=form.spassword ;
	   	  //  $scope.isLdap=form.ldap;
	   	    $scope.username=form.userName;
	   	    $scope.email=form.email;
	   	    $scope.mobile=form.mobile;
	   	    $scope.captcha = form.captcha;
	   	    
	   	   
	      
	        $scope.password = btoa($scope.password);
	   
	        
	        
	   	var signUpData = {userId:$scope.userid,password:$scope.password,
	   			 userName:$scope.username,
	   			email:$scope.email,mobileNum:$scope.mobile}
	   	 
	   
	    $http({
	    url: "./rest/jsonServices/signup",
	    method: "POST",
	    params: signUpData
	    }).success(function (response) {
 			    	 
	    	 if (response == 0) {
					$scope.showSuccessMsg();
				} else if (response == 1) {
					$scope.showWarningMsg("UserId");
				} else if (response == 2) {
					$scope.showWarningMsg("User Name");
				} else if (response == 3) {
					$scope.showWarningMsg("Email");
				} else if (response == 4) {
					$scope.showWarningMsg("Mobile Number");
				}
			});
	   	    
	   /* $rootScope.loggedIn = false;
        $rootScope.registereduser = false;
    	$rootScope.registration = false;*/
	   
	 }
	 
	 
	 
	 $scope.gotoHome=function(){
	        $rootScope.loggedIn = false;
	        $rootScope.registereduser = false;
	    	$rootScope.registration = false;
	    }
	
	  $scope.showSuccessMsg = function() {
		  
	      toastr.success('Thank You for Registering !');
	    };

	    $scope.showInfoMsg = function() {
	      toastr.info("You've got a new email!", 'Information');
	    };

	    $scope.showErrorMsg = function() {
	      toastr.error("Your information hasn't been saved!", 'Error');
	    };

	    $scope.showWarningMsg = function(value) {
	    	$scope.value= value;
	      toastr.warning($scope.value+ " already registered", 'Warning');
	    };
	    
	  
	 
	 }
	 
	
	 



})();