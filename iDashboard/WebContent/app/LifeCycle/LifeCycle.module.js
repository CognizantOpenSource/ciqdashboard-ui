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
          templateUrl: 'app/LifeCycle/lifecycledashboard.html',
        	  resolve : {
					loadMyCtrl : [
							'$ocLazyLoad',
							function($ocLazyLoad) {
								return $ocLazyLoad
										.load({
											files : [
													'app/LifeCycle/LifeCycleDashboardCtrl.js',
													'lib/ionicons.css'],
										});
							} ]
				}

         }) 
         
      .state('createDashbaord', {
          url: '/createDashbaord',
          directive:'baSidebar',
          templateUrl: 'app/LifeCycle/ProductDashboard/createnewDashboard.html',
          title: 'Create LifeCycle Dashboard', 
          resolve : {
				loadMyCtrl : [
						'$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad
									.load({
										files : [
												'app/LifeCycle/LifeCycleDashboardCtrl.js',
												'app/LifeCycle/Tools/SCM/GitHubCtrl.js',
												'app/LifeCycle/Tools/AppLifeCycle/Octane/octaneCtrl.js',
												'app/LifeCycle/Tools/AppLifeCycle/Jira/jiraLifecycleCtrl.js',
												'app/LifeCycle/Tools/SAST/FortifyCtrl.js',
												'app/LifeCycle/Tools/Infra/chefMetricsCtrl.js',
												'app/LifeCycle/Tools/CodeQuality/codeQualityCtrl.js',
												'app/LifeCycle/Tools/Build/buildMetricsCtrl.js',
												'app/LifeCycle/Tools/TestManagement/testManagementCtrl.js',
												'lib/moment.js',
												'lib/underscore.js',
												'lib/underscore-min.js',
												'lib/jquery.easypiechart.js'],
									});
						} ]
			}
           
        }) 
         .state('viewDashbaord', {
          url: '/viewDashbaord',
          directive:'baSidebar',
          templateUrl: 'app/LifeCycle/ProductDashboard/viewDashboard.html',
          title:'LifeCycle Dashboard', 
          resolve : {
				loadMyCtrl : [
						'$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad
									.load({
										files : [
												'app/LifeCycle/LifeCycleDashboardCtrl.js',
												'app/LifeCycle/Tools/SCM/GitHubCtrl.js',
												'app/LifeCycle/Tools/AppLifeCycle/Octane/octaneCtrl.js',
												'app/LifeCycle/Tools/AppLifeCycle/Jira/jiraLifecycleCtrl.js',
												'app/LifeCycle/Tools/Infra/chefMetricsCtrl.js',
												'app/LifeCycle/Tools/SAST/FortifyCtrl.js',
												'app/LifeCycle/Tools/CodeQuality/codeQualityCtrl.js',
												'app/LifeCycle/Tools/Build/buildMetricsCtrl.js',
												'app/LifeCycle/Tools/TestManagement/testManagementCtrl.js',
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
        .state(
						'createKpiDashbaord',
						{
							url : '/createKpiDashbaord',
							directive : 'baSidebar',
							templateUrl : 'app/LifeCycle/KpiDashboard/createKPIDashboard.html',
							title : 'DEVOPS KPI Dashboard',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/LifeCycleDashboardCtrl.js',
																'app/LifeCycle/KpiDashboard/KpiDashboardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}
						/*
						 * sidebarMeta: { icon: 'ion-ionic', order: 0, },
						 */
						})

				.state(
						'updateProdDashbaord',
						{
							url : '/updateProdDashbaord',
							directive : 'baSidebar',
							templateUrl : 'app/LifeCycle/lifecycle/updateProductDashboard.html',
							title : 'Release Dashboard',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/LifeCycleDashboardCtrl.js',
																'lib/raphael.min.js',
																'lib/justgage.js' ],
													});
										} ]
							}

						/*
						 * sidebarMeta: { icon: 'ion-ionic', order: 0, },
						 */
						})
				.state(
						'updateKpiDashbaord',
						{
							url : '/updateKpiDashbaord',
							directive : 'baSidebar',
							templateUrl : 'app/LifeCycle/KpiDashboard/UpdateKPIDashboard.html',
							title : 'DEVOPS KPI Dashboard',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/KpiDashboard/KpiDashboardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js',
																'lib/raphael.min.js',
																'lib/justgage.js' ],
													});
										} ]
							}

						/*
						 * sidebarMeta: { icon: 'ion-ionic', order: 0, },
						 */
						});
      
 
 
  }

})();
