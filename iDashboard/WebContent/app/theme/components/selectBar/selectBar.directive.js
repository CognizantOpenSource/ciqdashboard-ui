/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.theme.components')
      .directive('selectBar', selectBar);

  /** @ngInject */
  function selectBar() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/selectBar/selectBar.html'
    };
  }

})();