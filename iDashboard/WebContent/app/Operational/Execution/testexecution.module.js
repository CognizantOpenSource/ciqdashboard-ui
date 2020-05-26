/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.Operational.Execution', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('charts.testexecution', {
          url: '/testexecution',
          templateUrl: 'app/Operational/Execution/testexecution.html',
          title: 'Test Execution',
           sidebarMeta: {
            order: 0,
          },  
        });
  }


})();
