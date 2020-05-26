/**
 * @author v.lugovsky created on 16.12.2015
 */
(function() {
	'use strict';

	angular
			.module('MetricsPortal.Dashboard', [])
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
						'Operational',
						{
							url : '/Operational',
							directive : 'baSidebar',
							templateUrl : 'app/Operational/Home/operationalDashBoard.html',
							title : 'Operational Dashboard',
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
																		'lib/angular-morris-chart.min.js'],
															});
												} ]
									}
								});

				

		
	}

})();
