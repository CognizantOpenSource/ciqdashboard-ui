/**
 * @author v.lugovksy created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.LifeCycle.lifecycle.codeRepo')
      .controller('codeRepoCtrl', codeRepoCtrl);

  /** @ngInject */
  function codeRepoCtrl($scope,$http,$timeout) {	  

	  $scope.message="Hi";
	  
  }
	  })();