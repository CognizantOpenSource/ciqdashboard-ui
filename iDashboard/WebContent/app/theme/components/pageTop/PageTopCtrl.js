/**
* @author v.lugovsky
* created on 16.12.2015
*/
(function () {
  'use strict';

  angular.module('MetricsPortal.theme.components')
      .controller('PageTopCtrl', PageTopCtrl);

  /** @ngInject */
  function PageTopCtrl($http, $scope, $filter, $uibModal, editableOptions, editableThemes,$rootScope) {
   

		  $rootScope.loggedInuserId = localStorageService.get('loggedInuserId');
		  	 
		
                  $scope.standardItem = {};
                  $scope.standardSelectItems = [
                      {label: 'AT&T_Demo', value: 1},
                      {label: 'AT&T_Release', value: 2},
                      {label: 'AT&T_Prod', value: 3}
                       
                    ];
                  
                  $scope.businessenv = {};
                  $scope.businessEnvironment = [
                      {label: 'Development', value: 1},
                      {label: 'Beta', value: 2},
                      {label: 'SanityTest Env', value: 3},
                      {label: 'PreProduction', value: 4},
                      {label: 'Production', value: 5}
                    ];
                  
                  $scope.releases = {};
                  $scope.release= [
                      {label: 'Release_01', value: 1},
                      {label: 'Release_02', value: 2},
                      {label: 'Release_03', value: 3},
                      {label: 'Release_04', value: 4},
                      {label: 'Release_05', value: 5}
                    ];
                  
                
                
   
  }
  })();
