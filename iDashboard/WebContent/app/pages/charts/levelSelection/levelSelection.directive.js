/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.charts')
      .directive('levelSelection', levelSelection);

  /** @ngInject */
  function levelSelection() {
    return {
      restrict: 'E',
      templateUrl: 'app/pages/charts/levelSelection/levelSelection.html'
    };
  }

})();