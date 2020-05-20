/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.QBot', [
    'ui.router'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider,$stateProvider,$routeProvider) { 
      $stateProvider 
      .state('dashbot', {
          url: '/dashbot',
          directive:'baSidebar',
          templateUrl: 'app/QBot/qbot/qbotHome.html',
          controller:'qbotHomeController',
          
          title: 'Intelligent', 
          resolve : {
				loadMyCtrl : [ '$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						files : [ 'app/QBot/qbot/qbotHomeController.js', ],
					});
				} ]
			}

   
        }); 
  
  }

})();
