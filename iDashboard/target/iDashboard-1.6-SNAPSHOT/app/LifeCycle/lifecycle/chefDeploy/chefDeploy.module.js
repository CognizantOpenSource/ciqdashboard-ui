/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.LifeCycle.lifecycle.chefDeploy', [])
      .config(routeConfig).config(amChartConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('chefDeploy', {
          url: '/chefDeploy',
          directive:'baSidebar',
          templateUrl: 'app/LifeCycle/lifecycle/chefDeploy/chefDeploy.html',
          title: 'Deployments',
            sidebarMeta: {
            order: 0,
          }, 
        });
  }
  
  function amChartConfig(baConfigProvider) {
	  
  }


})();
