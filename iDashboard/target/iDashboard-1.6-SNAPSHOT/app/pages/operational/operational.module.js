/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.operational', [
	'ui.router',
	'MetricsPortal.pages.operational'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider,$stateProvider,$routeProvider) {
    $stateProvider
        .state('operational', {
          url: '/operational',
          directive:'baSidebar',
          templateUrl: 'app/pages/operational/operational.html',
          title: 'Dashboard',
        });
        
        
        /*.state('createDashbaordOperational', {
          url: '/createDashbaordOperational',
          directive:'baSidebar',
          templateUrl: 'app/pages/operational/createOperationalDashboard.html',
          
          title: 'Create Dashboard', 
          
           sidebarMeta: {
            icon: 'ion-ionic',
            order: 0,
          }, 
        }) 
         .state('viewDashbaordOperational', {
          url: '/viewDashbaordOperational',
          directive:'baSidebar',
          templateUrl: 'app/pages/operational/viewOperationalDashboard.html',
          
          title:'Dashboard', 
          
           sidebarMeta: {
            icon: 'ion-ionic',
            order: 0,
          }, 
        })
        .state('dashboard', {
            url: '/dashboard',
            directive:'baSidebar',
            templateUrl: 'app/pages/dashboard/dashboard.html',
            title: 'Dashboard',
          
         sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, 
           
        
          });*/
  }

})();
