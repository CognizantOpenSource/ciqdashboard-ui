/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.charts.testcases', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('charts.testcases', {
          url: '/testcases',
          templateUrl: 'app/pages/charts/testcases/testcasesmain.html',
          title: 'Test Design',
         sidebarMeta: {
            order: 0,
          }, 
        });
  }


})();
