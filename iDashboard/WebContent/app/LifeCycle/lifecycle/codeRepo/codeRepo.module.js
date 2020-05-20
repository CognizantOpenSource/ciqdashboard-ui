/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.LifeCycle.lifecycle.codeRepo', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('codeRepo', {
          url: '/codeRepo',
          directive:'baSidebar',
          templateUrl: 'app/LifeCycle/lifecycle/codeRepo/codeRepo.html',
          title: 'Code Repository',
            sidebarMeta: {
            order: 0,
          }, 
        });
  }


})();
