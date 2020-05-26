/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.Operational.Requirements')
      .controller('ModifiedRequirementsCtrl', ModifiedRequirementsCtrl);

  /** @ngInject */
  function ModifiedRequirementsCtrl($http, $scope, AES, $filter, $uibModal, editableOptions, editableThemes,$window) {
	  function getEncryptedValue()
	  {
		 var username= localStorageService.get('userIdA');
	     var password= localStorageService.get('passwordA');
	        var tokeen =$base64.encode(username+":"+password);
	        
	        return tokeen;
	        }
	  var token  = AES.getEncryptedValue();
      var config = {headers: {
              'Authorization': token
              }};
	   $http.get("./rest/jsonServices/modifiedrequirmentDetails",config).success(function (response) {
		 		$scope.modReq = response;			 	 
		   }); 
  }})();
