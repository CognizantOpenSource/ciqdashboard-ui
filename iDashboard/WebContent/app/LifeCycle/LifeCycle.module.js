/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.LifeCycle', [
    'ui.router',
    'MetricsPortal.LifeCycle.lifecycle'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider,$stateProvider,$routeProvider) { 
      $stateProvider 
      .state('lifecycledashboard', {
          url: '/lifecycledashboard',
          title:'Life Cycle View',
          templateUrl: 'app/LifeCycle/lifecycle/lifecycledashboard.html',
        	  resolve : {
					loadMyCtrl : [
							'$ocLazyLoad',
							function($ocLazyLoad) {
								return $ocLazyLoad
										.load({
											files : [
													'app/LifeCycle/lifecycle/LifeCycleDashboardCtrl.js',
													'lib/ionicons.css'],
										});
							} ]
				}

         }) 
         
      .state('createDashbaord', {
          url: '/createDashbaord',
          directive:'baSidebar',
          templateUrl: 'app/LifeCycle/lifecycle/createnewDashboard.html',
          title: 'Create LifeCycle Dashboard', 
          resolve : {
				loadMyCtrl : [
						'$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad
									.load({
										files : [
												'app/LifeCycle/lifecycle/LifeCycleDashboardCtrl.js',
												'app/LifeCycle/charts/GitHub/GitChartCtrl.js',
												'app/LifeCycle/lifecycle/userstories/userstoriesdata/UserStoryLifeCtrl.js',
												'app/LifeCycle/charts/chefDataChart/chefRunsDetailsCtrl.js',
												'app/LifeCycle/charts/CodeAnalysisChart/CodeAnalysisChartCtrl.js',
												'app/LifeCycle/charts/buildChart/buildMetricsCtrl.js',
												'app/LifeCycle/charts/TMChart/testManagementMetricsCtrl.js',
												'lib/moment.js',
												'lib/underscore.js',
												'lib/underscore-min.js',
												'lib/jquery.easypiechart.js'],
									});
						} ]
			}
          /* sidebarMeta: {
            icon: 'ion-ionic',
            order: 0,
          },*/ 
        }) 
         .state('viewDashbaord', {
          url: '/viewDashbaord',
          directive:'baSidebar',
          templateUrl: 'app/LifeCycle/lifecycle/viewDashboard.html',
          title:'LifeCycle Dashboard', 
          resolve : {
				loadMyCtrl : [
						'$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad
									.load({
										files : [
												'app/LifeCycle/lifecycle/LifeCycleDashboardCtrl.js',
												'app/LifeCycle/charts/GitHub/GitChartCtrl.js',
												'app/LifeCycle/lifecycle/userstories/userstoriesdata/UserStoryLifeCtrl.js',
												'app/LifeCycle/charts/chefDataChart/chefRunsDetailsCtrl.js',
												'app/LifeCycle/charts/CodeAnalysisChart/CodeAnalysisChartCtrl.js',
												'app/LifeCycle/charts/buildChart/buildMetricsCtrl.js',
												'app/LifeCycle/charts/TMChart/testManagementMetricsCtrl.js',
												'lib/moment.js',
												'lib/underscore.js',
												'lib/underscore-min.js'
												],
									});
						} ]
			}
          /* sidebarMeta: {
            icon: 'ion-ionic',
            order: 0,
          },*/ 
        }) 
        ;
      
 
 
  }

})();
