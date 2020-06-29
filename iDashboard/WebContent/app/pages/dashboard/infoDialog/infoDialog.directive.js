/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.dashboard')
      .directive('infoDialog', infoDialog);

  /** @ngInject */
  function infoDialog() {
    return {
      restrict: 'E',
      controller: 'infoDialogCtrl',
      templateUrl: 'app/pages/dashboard/infoDialog/infoDialog.html'
    };
  }
})();