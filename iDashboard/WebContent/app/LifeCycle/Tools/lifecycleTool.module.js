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
				.state('build', {
					url : '/build',
					title : 'Builds',
					templateUrl : 'app/LifeCycle/Tools/Build/buildMetricsHome.html'

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
																'app/LifeCycle/LifeCycleDashboardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}
						/*
						 * sidebarMeta: { icon: 'ion-ionic', order: 0, },
						 */
						})
				
				.state(
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
																'lib/angularjs-dropdown-multiselect.js' ],
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
							templateUrl : 'app/LifeCycle/Tools/CodeQuality/codeQualityMore.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/Tools/CodeQuality/codeQualityCtrl.js' ],
													});
										} ]
							}
						})
				.state(
						'buildMetrics',
						{
							url : '/buildMetrics',
							title : 'Build Metrics',
							templateUrl : 'app/LifeCycle/Tools/Build/buildMetricsMore.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/Tools/Build/buildMetricsCtrl.js',
																'lib/moment.js',
																'lib/underscore.js',
																'lib/underscore-min.js', ],
													});
										} ]
							}
						})
				.state(
						'testMgmtMetrics',
						{
							url : '/testMgmtMetrics',
							title : 'Test Management Metrics',
							templateUrl : 'app/LifeCycle/Tools/TestManagement/testManagementMore.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/Tools/TestManagement/testManagementCtrl.js',
																'lib/funnel-chart.js',
																'lib/chart.funnel.js' ],
													});
										} ]
							}
						})

				.state(
						'viewgitdashboard',
						{
							url : '/githubmetrics',
							title : 'SCM Dashboard',
							templateUrl : 'app/LifeCycle/Tools/SCM/GitHubMore.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [ 'app/LifeCycle/Tools/SCM/GitHubCtrl.js' ],
													});
										} ]
							}
						})

				.state(
						'viewfortifydashboard',
						{
							url : '/viewfortifydashboard',
							title : 'Fortify Dashboard',
							templateUrl : 'app/LifeCycle/Tools/SAST/fortifyMore.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [ 'app/LifeCycle/Tools/SAST/FortifyCtrl.js'],
													});
										} ]
							}
						})

				.state(
						'userstorieslifecycledetails',
						{
							url : '/userstoriesmoredetails',
							title : 'User Story Life Cycle',
							templateUrl : 'app/LifeCycle/Tools/AppLifeCycle/Jira/jiraMore.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/LifeCycle/Tools/AppLifeCycle/Jira/jiraLifecycleCtrl.js',
																'app/pages/charts/requirements/requirementsdata/RequirementsCtrl.js' ],
													});
										} ]
							}
						})
				.state(
						'chefrundetails',
						{
							url : '/chefrundetails',
							title : 'Chef Run Details',
							templateUrl : 'app/LifeCycle/Tools/Infra/chefMetricsMore.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'lib/funnel-chart.js',
																'app/LifeCycle/Tools/Infra/chefMetricsCtrl.js', ],
													});
										} ]
							}
						})
						
						.state(
						'octanelifecycledetails',
						{
							url : '/octanelifecycledetails',
							title : 'ALMOctane',
							templateUrl : 'app/LifeCycle/Tools/AppLifeCycle/Octane/octaneMore.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [ 'app/LifeCycle/Tools/AppLifeCycle/Octane/octaneCtrl.js' ],
													});
										} ]
							}
						})
						
				.state(
						'chefnodedetails',
						{
							url : '/chefnodedetails',
							title : 'Chef Node Details',
							templateUrl : 'app/LifeCycle/Tools/Infra/chefNodeDetails.html'

						});

	}

})();
