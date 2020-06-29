/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.charts.testexecution', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('charts.testexecution', {
          url: '/testexecution',
          templateUrl: 'app/pages/charts/testexecution/testexecution.html',
          title: 'Test Execution',
           sidebarMeta: {
            order: 0,
          },  
        });
  }


})();
