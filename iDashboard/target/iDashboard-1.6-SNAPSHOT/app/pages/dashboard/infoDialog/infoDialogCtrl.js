/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.dashboard')
      .controller('infoDialogCtrl', infoDialogCtrl);

  /** @ngInject */
 function infoDialogCtrl($scope, $uibModal, baProgressModal) {
	 $scope.open = function (url,size) {      
	        $uibModal.open({
	        animation: true,
	        templateUrl: url,
	       
	        scope: $scope,
	        size: size,
	        resolve: {
	           items: function () {
	           return $scope.items;
	          }
	        }
	        });
	      };
	 
	 
/*	 
    $scope.open = function (page,size) {
    	
      $uibModal.open({
    	 
        animation: true,
        templateUrl: page,
        scope: $scope,
        size: size,
        //size: size,id: div_id,
        resolve: {
          items: function () {
            return $scope.items;
          }
     
        }
      });
    };*/
    $scope.openProgressDialog = baProgressModal.open;
  }


})();
