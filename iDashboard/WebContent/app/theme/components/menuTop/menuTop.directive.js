/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.theme.components')
      .directive('menuTop', menuTop);

  /** @ngInject */
  function menuTop() {
    return {
    	
      restrict: 'E',
      templateUrl: 'app/theme/components/menuTop/menuTop.html',
    	 
    		 controller: 'LoginCtrl'
    };
  }

})();