/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.LifeCycle.lifecycle.build', [])
      .config(routeConfig).config(amChartConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('build', {
          url: '/build',
          directive:'baSidebar',
          templateUrl: 'app/LifeCycle/lifecycle/build/build.html',
          title: 'Builds',
            sidebarMeta: {
            order: 0,
          }, 
        });
  }
  
  function amChartConfig(baConfigProvider) {
	  
  }


})();
