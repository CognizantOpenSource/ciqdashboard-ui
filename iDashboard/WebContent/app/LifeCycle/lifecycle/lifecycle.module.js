/**
 * @author v.lugovsky created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle.lifecycle', []).config(routeConfig);

	/** @ngInject */
	function routeConfig($urlRouterProvider, baSidebarServiceProvider,
			$stateProvider, $routeProvider) {
		$stateProvider
				.state(
						'codeRepo',
						{
							url : '/codeRepo',
							title : 'Code Repository',
							templateUrl : 'app/LifeCycle/lifecycle/codeRepo/codeRepoData/codeRepoData.html'

						})

				.state('build', {
					url : '/build',
					title : 'Builds',
					templateUrl : 'app/LifeCycle/lifecycle/build/build.html'

				})
				.state(
						'createProdDashbaord',
						{
							url : '/createProdDashbaord',
							directive : 'baSidebar',
							templateUrl : 'app/LifeCycle/lifecycle/createProductDashboard.html',
							title : 'Release Dashboards',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/lifecycle/LifeCycleDashboardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}
						/*
						 * sidebarMeta: { icon: 'ion-ionic', order: 0, },
						 */
						})
				.state(
						'createKpiDashbaord',
						{
							url : '/createKpiDashbaord',
							directive : 'baSidebar',
							templateUrl : 'app/LifeCycle/lifecycle/createKPIDashboard.html',
							title : 'DEVOPS KPI Dashboard',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/lifecycle/LifeCycleDashboardCtrl.js',
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
																'app/LifeCycle/lifecycle/LifeCycleDashboardCtrl.js',
																'lib/raphael.min.js',
																'lib/justgage.js'],
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
							templateUrl : 'app/LifeCycle/lifecycle/UpdateKPIDashboard.html',
							title : 'DEVOPS KPI Dashboard',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/lifecycle/KpiDashboardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js',
																'lib/raphael.min.js',
																'lib/justgage.js'],
													});
										} ]
							}

						/*
						 * sidebarMeta: { icon: 'ion-ionic', order: 0, },
						 */
						}).state(
								'requirementKpi',
								{
									url : '/requirementKpi',
									directive : 'baSidebar',
									templateUrl : 'app/LifeCycle/lifecycle/requirementKpi.html',
									title : 'Requirements/User Stories',
									resolve : {
										loadMyCtrl : [
												'$ocLazyLoad',
												function($ocLazyLoad) {
													return $ocLazyLoad
															.load({
																files : [
																		'app/LifeCycle/lifecycle/KpiDashboardCtrl.js',
																		'lib/angularjs-dropdown-multiselect.js'],
															});
												} ]
									}

								/*
								 * sidebarMeta: { icon: 'ion-ionic', order: 0, },
								 */
								})

				.state(
						'codeanalysis',
						{
							url : '/codeanalysis',
							title : 'Code Analysis',
							templateUrl : 'app/LifeCycle/lifecycle/codeAnalysis/codeAnalysis.html',
							resolve : {
									loadMyCtrl : [
											'$ocLazyLoad',
											function($ocLazyLoad) {
												return $ocLazyLoad
														.load({
															files : [
																	'app/LifeCycle/charts/CodeAnalysisChart/CodeAnalysisChartCtrl.js', ],
														});
											} ]
								}
						})
				.state(
						'buildMetrics',
						{
							url : '/buildMetrics',
							title : 'Build Metrics',
							templateUrl : 'app/LifeCycle/charts/buildChart/buildMetrics.html',
								resolve : {
									loadMyCtrl : [
											'$ocLazyLoad',
											function($ocLazyLoad) {
												return $ocLazyLoad
														.load({
															files : [
																	'app/LifeCycle/charts/buildChart/buildMetricsCtrl.js',
																	'lib/moment.js',
																	'lib/underscore.js',
																	'lib/underscore-min.js',
																	],
														});
											} ]
								}
						})
				.state(
						'testMgmtMetrics',
						{
							url : '/testMgmtMetrics',
							title : 'Test Management Metrics',
							templateUrl : 'app/LifeCycle/charts/TMChart/testManagementMetrics.html',
							resolve : {
									loadMyCtrl : [
											'$ocLazyLoad',
											function($ocLazyLoad) {
												return $ocLazyLoad
														.load({
															files : [ 'app/LifeCycle/charts/TMChart/testManagementMetricsCtrl.js',
																	  'lib/funnel-chart.js',
															          'lib/chart.funnel.js'
															        ],
														});
											} ]
								}
						})

				.state(
						'viewgitdashboard',
						{
							url : '/viewgitdashboard',
							title : 'SCM Dashboard',
							templateUrl : 'app/LifeCycle/charts/GitHub/viewGitDashboard.html',
								resolve : {
									loadMyCtrl : [
											'$ocLazyLoad',
											function($ocLazyLoad) {
												return $ocLazyLoad
														.load({
															files : [ 'app/LifeCycle/charts/GitHub/GitChartCtrl.js' ],
														});
											} ]
								}
						})
						
						.state(
						'userstorieslifecycledetails',
						{
							url : '/userstorieslifecycledetails',
							title : 'User Story Life Cycle',
							templateUrl : 'app/LifeCycle/lifecycle/userstories/userstoriesMain.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/lifecycle/userstories/userstoriesdata/UserStoryLifeCtrl.js',
																'app/pages/charts/requirements/requirementsdata/RequirementsCtrl.js'],
													});
										} ]
							}
						})
				.state(
						'chefrundetails',
						{
							url : '/chefrundetails',
							title : 'Chef Run Details',
							templateUrl : 'app/LifeCycle/lifecycle/chefDeploy/chefDeploy.html',
								resolve : {
									loadMyCtrl : [
											'$ocLazyLoad',
											function($ocLazyLoad) {
												return $ocLazyLoad
														.load({
															files : [
																	'lib/funnel-chart.js',
																	'app/LifeCycle/charts/chefDataChart/chefRunsDetailsCtrl.js', ],
														});
											} ]
								}
						})
				.state(
						'chefnodedetails',
						{
							url : '/chefnodedetails',
							title : 'Chef Node Details',
							templateUrl : 'app/LifeCycle/charts/chefDataChart/chefNodeDetails.html'

						});

	}

})();
