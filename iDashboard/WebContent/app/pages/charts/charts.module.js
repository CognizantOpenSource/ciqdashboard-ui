/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.charts', [
      'MetricsPortal.pages.charts.requirements',
      'MetricsPortal.pages.charts.testcases',
      'MetricsPortal.pages.charts.testexecution',
      'MetricsPortal.pages.charts.defects',
      'MetricsPortal.pages.charts.userstories',
   
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('charts', {
          url: '/charts',
          abstract: true,
          directive:'baSidebar',
          template: '<div ui-view  autoscroll="true" autoscroll-body-top></div>',
          title: 'Metrics',
          sidebarMeta: {
              icon: 'ion-stats-bars',
              order: 150,
            }, 
        });
  }

})();
