/**
 * @author v.lugovsky created on 16.12.2015
 */
(function() {
	'use strict';

	angular
			.module('MetricsPortal.pages.dashboard', [])
			.config(routeConfig)
			.config(
					function(baConfigProvider) {
						var layoutColors = baConfigProvider.colors;
						Morris.Donut.prototype.defaults.backgroundColor = 'transparent';
						Morris.Donut.prototype.defaults.labelColor = layoutColors.defaultText;
						Morris.Grid.prototype.gridDefaults.gridLineColor = layoutColors.borderDark;
						Morris.Grid.prototype.gridDefaults.gridTextColor = layoutColors.defaultText;
					});

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider

				.state(
						'operational',
						{
							url : '/operational',
							directive : 'baSidebar',
							templateUrl : 'app/pages/operational/operationalDashBoard.html',
							title : 'Operational Dashboard',
						})

				.state(
						'dashboard',
						{
							url : '/dashboard',
							directive : 'baSidebar',
							templateUrl : 'app/pages/dashboard/dashboard.html',
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
																'app/pages/dashboard/dashboardPieChart/DashboardPieChartCtrl.js',
																'app/pages/dashboard/artifactCountCtrl.js',
																'app/pages/charts/userstories/userstoriesdata/UserStoryCtrl.js',
																'app/pages/charts/requirements/requirementsdata/RequirementsCtrl.js',
																'app/pages/charts/testcases/testcasesdata/TestCasesCtrl.js',
																'app/pages/charts/testcases/testcasesdata/JiraTestCasesCtrl.js',
																'app/pages/charts/defects/defectsdata/defectsCtrl.js',
																'app/pages/charts/defects/defectsdata/defectsJiraCtrl.js',
																'app/pages/charts/testexecution/testexecutiondata/TestExecutionCtrl.js',
																'lib/funnel-chart.js',
																'lib/jquery.easypiechart.js',
																'app/pages/dashboard/highlightsCtrl.js',
																'lib/raphael.min.js',
																'lib/morris.css',
																'lib/morris.min.js',
																'lib/angular-morris-chart.min.js'],
													});
										} ]
							}
						});

		
	}

})();
