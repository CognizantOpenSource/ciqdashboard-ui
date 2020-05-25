/**
* @author v.lugovsky
* created on 16.12.2015
*/
(function () {
  'use strict';

  angular.module('MetricsPortal.theme.components')
      .controller('SelectBarCtrl', SelectBarCtrl);

  /** @ngInject */
  function SelectBarCtrl($http, $scope, $filter, $uibModal, editableOptions, editableThemes) {
   
	  
				  $scope.towers = {};
			      $scope.tower= [
			          {label: 'SORABH SAXENA', value: 1},
			          {label: 'WILLIAM O`HERN', value: 2},
			          {label: 'TERESA OSTAPOWER', value: 3},
			          {label: 'PAMELA PARISIAN', value: 4},
			          {label: 'JON SUMMERS', value: 5}
			        ];
			      
                  $scope.standardItem = {};
                  $scope.standardSelectItems = [
                      {label: 'CSI - Adapter (ALMQC)', value: 1},
                      {label: 'CSI - Order and Subscription Mngt (ALMQC)', value: 2},
                      {label: 'CSI - CPSVC (ALMQC)', value: 3},
                      {label: 'CSI - (FED) - ESB-NIS (ALMQC)', value: 4},
                      {label: 'CSI - (FED) - OVALS (ALMQC)', value: 5},
                      {label: 'CSI - (FED) - AIC (ALMQC)', value: 6},
                      {label: 'CSI - (FED) - C-BUS (ALMQC)', value: 7},
                      {label: 'CSI - (FED) - eCORP Assessments (ALMQC)', value: 8},
                      {label: 'Front End Retail -  (RALLY)', value: 9},
                      {label: 'INTEGRATED CLOUD  (RALLY)', value: 10},
                      {label: 'uDas - The Right Stuff (RALLY)', value: 11}
                       
                    ];
                  
                  $scope.businessenv = {};
                  $scope.businessEnvironment = [
                      {envlabel: 'DEV', value: 1},
                      {envlabel: 'PROD', value: 2},
                      {envlabel: 'TEST', value: 3},
                      {envlabel: 'PERFORMANCE', value: 4}
                      
                    ];
                  
                                  
                  $scope.releases = {};
                  $scope.release= [
                      {label: '2016.12', value: 1},
                      {label: '2016.12', value: 2},
                      {label: '2016.12', value: 3},
                      {label: '2016.12', value: 4},
                      {label: '2016.12', value: 5},
                      {label: '2016.12', value: 6},
                      {label: '2016.11', value: 7},
                      {label: '2016.11', value: 8},
                      {label: '2016.11', value: 9},
                      {label: '2016.11', value: 10},
                      {label: '2016.11', value: 11}
                      
                    ];
                  
                  
  
   
  }
  })();
