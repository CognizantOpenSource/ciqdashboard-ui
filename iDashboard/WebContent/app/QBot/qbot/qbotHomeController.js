/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

 
  
  angular.module('MetricsPortal.pages')
      .controller('qbotHomeController', qbotHomeController);

  /** @ngInject */
  function qbotHomeController($scope,$rootScope, $location, $state,$http,localStorageService,$base64) {
	  var inputValue="";
	  var charCode="";
	  $rootScope.menubar = false;
		$rootScope.var1=false;
		$rootScope.var2=false;
		$rootScope.var3=true;
		$rootScope.var4=false;
		$rootScope.var7=false;
		function getEncryptedValue()
		  {
			 var username= localStorageService.get('userIdA');
		     var password= localStorageService.get('passwordA');
		        var tokeen =$base64.encode(username+":"+password);
		        
		        return tokeen;
		        }
		
	  $scope.search=function(inputValue)
	  {
		  $scope.keyword=inputValue;
		 //console.log("inside search--"+inputValue); 
		 inputValue=btoa(inputValue);
		 $location.path('/dashbotlanding/'+inputValue);
		 	 
		 
	  };
	  
	  $scope.checkQbotHome = function(){
		  var token  = getEncryptedValue();
	        var config = {headers: {
	                'Authorization': token
	                }};
		  $http.get("rest/qbotServices/checkQbotHome",config).success(function (response) {
				$scope.status = response; 
		 });  
	  }
	  
	  
	  $scope.keyevent=function (keyCode,myValue) {
		  //console.log(keyCode);
		    charCode = myValue;        
		    //console.log(charCode);
		    inputValue=charCode;
		    //console.log(inputValue.length);
		    if(inputValue.length>0)
			  {

		    	$http.get('app/QBot/qbot/connection.properties').then(function (response) {
			         
			          
			          var url=response.data.predictUrl;			       
			          
			          $scope.getPredictDataBasedOnUrl(url);
			         
			        });

		    	  $scope.getPredictDataBasedOnUrl=function(url)
			      {		    		 
		        	 var url1= url+inputValue;
		        	 
		        	 //console.log("prediction in home controller " + url1);

		    $http({
		            url: url1,
		            method: "GET",
		            dataType: "json"}).
		            success(function (response) {
		            	getTypeAheadValues(response);
		            });
			  }
			  }
	  }
	  function getTypeAheadValues(response)
	  {
	 // $scope.Countries = response.predictedValues;
		  $scope.titles=[];
		  $scope.titles=response;
		  //console.log($scope.titles);
	  }

	  $scope.homeSearchTxt1=function(selected)
	  {
		  if(selected)
			  //console.log(typeof(selected.originalObject));
		  	  $scope.keyword=selected.originalObject.key;
		  	  //console.log($scope.keyword);		 
		  	  $scope.search($scope.keyword);
	
	  }
	  
	 // $scope.titles = [ "Action Comics" , "Detective Comics" , "Superman" , "Fantastic Four" , "Amazing Spider-Man" ];
	  
  }
  
  

})();