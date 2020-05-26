/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.Operational', [
      'MetricsPortal.Operational.Requirements',
      'MetricsPortal.Operational.Design',
      'MetricsPortal.Operational.Execution',
      'MetricsPortal.Operational.Defects',
      'MetricsPortal.Operational.UserStories',
   
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
        }).state(
				'dashboard',
				{
					url : '/dashboard',
					directive : 'baSidebar',
					templateUrl : 'app/Dashboard/dashboard.html',
					title : 'Dashboard',
					sidebarMeta : {
						icon : 'ion-android-home',
						order : 0,
					},
					resolve : {
						loadMyCtrl : [
								'$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad
											.load({
												files : [
														'app/Dashboard/DashboardPieChartCtrl.js',
														'app/Dashboard/artifactCountCtrl.js',
														'app/Operational/UserStories/UserStoryCtrl.js',
														'app/Operational/Requirements/RequirementsCtrl.js',
														'app/Operational/Design/TestCasesCtrl.js',
														'app/Operational/Design/JiraTestCasesCtrl.js',
														'app/Operational/Defects/defectsCtrl.js',
														'app/Operational/Defects/defectsJiraCtrl.js',
														'app/Operational/Execution/TestExecutionCtrl.js',
														'app/Login/loginCtrl.js',
														'lib/funnel-chart.js',
														'lib/jquery.easypiechart.js',
														'app/Dashboard/highlightsCtrl.js',
														'lib/raphael.min.js',
														'lib/morris.css',
														'lib/morris.min.js',
														'lib/angular-morris-chart.min.js' ],
											});
								} ]
					}
				}).state(
						'Summaryslideshowpopup',
						{
							url : '/Summaryslideshowpopup',
							directive : 'baSidebar',
							templateUrl : 'app/Operational/SummarySlideShow/Summaryslideshowpopup.html',
							title : '',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'lib//jquery.easing.js',
																'app/Operational/SummarySlideShow/SummaryslideShowCtrl.js' ],
													});
										} ]
							}

						});
  }

})();
