/* @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.charts')
      .controller('LevelSelectionCtrl', LevelSelectionCtrl);

  /** @ngInject */
  function LevelSelectionCtrl($http, $scope,$base64, $timeout, baConfig, baUtil,$rootScope) {
	  
	  /*function getEncryptedValue()
		 {
		       var username= $rootScope.userIdA;
		       var password= $rootScope.passwordA;
		       var tokeen =$base64.encode(username+":"+password);
		       return tokeen;
		       }*/
	  // Data for drop downs on initial Page Load 	  
	  $scope.initial = function(DomainVal,EnvVal,RelVal){
		  $scope.dropdowndomain(DomainVal);
		  $scope.dropdownproject(EnvVal);
		  $scope.dropdownrelease(RelVal);
	  }
	  $scope.projectlevel = function() {
		 var token  = getEncryptedValue();
	      var config = {headers: {
	              'Authorization': token
	              }};
	      $http.get("rest/jsonServices/projectlevel",config).success(function (response) {
	      	$scope.project = response; 
	      	$scope.projectdata = {};
	      	$scope.projectleveldata = $scope.project ;
	              $scope.allDomains = $scope.projectleveldata;
	              $scope.domains = $scope.allDomains;
	        }); 
	       }
	      $scope.selectedValue=function(selectedValueInProject){  
	    	  var token  = getEncryptedValue();
		      var config = {headers: {
		              'Authorization': token
		              }};
	    	  $rootScope.selectedproject = selectedValueInProject;
	    	  $rootScope.DomainVal=$rootScope.selectedproject;
	      		$scope.selectedproject = selectedValueInProject;
	  	$http.get("rest/jsonServices/environmentlevel?selectedproject="+$scope.selectedproject,config).success(function (response) {
	  			$scope.environment = response; 
	  			$scope.businessenv = {};
	  			$scope.businessEnvironment = $scope.environment;
	  			$scope.allProjects = $scope.businessEnvironment;
	  			$scope.projects = $scope.allProjects;
	       }) ;

	      };

	      $scope.envlevel = function(selectedValueInEnvironment) {
	    	 var token  = getEncryptedValue();
		      var config = {headers: {
		              'Authorization': token
		              }};
	    	  $rootScope.selectedValueInEnvironment = selectedValueInEnvironment;
	    	  $rootScope.EnvVal=$rootScope.selectedValueInEnvironment;
	      		$scope.selectedenv = selectedValueInEnvironment;
	      $http.get("rest/jsonServices/releaselevel?selectedenv="+$scope.selectedenv+"&selectedproject="+$scope.selectedproject,config).success(function (response) {
	      		$scope.releasedata = response; 
	      		$scope.releases = {};
	      		$scope.release= $scope.releasedata;
	  			$scope.allReleases = $scope.release;
	  			$scope.releases = $scope.allReleases;
	       }) ;
	      };
	      
	      $scope.releaselevel = function(selectedValueInRelease) {
	    	 
	    	  $rootScope.selectedValueInRelease = selectedValueInRelease;
	    	  $rootScope.RelVal=$rootScope.selectedValueInRelease;
	      }
	 
	      $scope.dropdowndomain = function(domain) {
	    	 if(domain == undefined || domain == null){
	    			domain = "";
	    	 }
	    	  	$rootScope.domain = domain;
		    	
		    	$rootScope.newDomainExecution($rootScope.domain);
		    	$rootScope.newDomainDefects($rootScope.domain);		  
		    	$rootScope.newDomainArtifacts($rootScope.domain);	
		    	$rootScope.newDomainReq($rootScope.domain);
				$rootScope.newDomainDesign($rootScope.domain);
	      }
	         $scope.dropdownproject = function(project){
	    	  if(project == undefined || project == null){
	    		  project = "";
	    		}
				$rootScope.project = project;
				$rootScope.newProjectExecution($rootScope.project);
				$rootScope.newProjectDefects($rootScope.project);
				$rootScope.newProjectReq($rootScope.project);
				$rootScope.newProjectDesign($rootScope.project);
				
				$rootScope.newProjectArtifacts($rootScope.project);		  
      }
	      $scope.dropdownrelease = function(release){

	    	  if(release == undefined || release == null){
	    		  release = "";
	    		  }
	    	
				$rootScope.release = release;
				$rootScope.newReleaseExecution($rootScope.release);
				$rootScope.newReleaseDefects($rootScope.release);
				$rootScope.newReleaseReq($rootScope.release);
				$rootScope.newReleaseDesign($rootScope.release);
				
				$rootScope.newReleaseArtifacts($rootScope.release);		  
	      }

  }
})();