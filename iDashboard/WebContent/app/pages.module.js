/**
 * @author v.lugovsky created on 16.12.2015
 */
(function() {
	'use strict';

	angular
			.module(
					'MetricsPortal.pages',
					[ 'ui.router', 'MetricsPortal.Dashboard',
							'MetricsPortal.pages.reportData',
							   'MetricsPortal.pages.riskCompliance',
							'MetricsPortal.Login','MetricsPortal.Operational' ]).config(routeConfig);

	/** @ngInject */
	function routeConfig($urlRouterProvider, baSidebarServiceProvider,
			$stateProvider, $routeProvider) {

		$stateProvider
				.state('createUser', {
					url : '/createUser',

					templateUrl : 'app/admin/UserManagement/CreateUser/createUser.html',
					title : 'Create New User',

				})
				.state(
						'defectDataProcurement',
						{
							url : '/defectDataProcurement',
							title : 'Defect Analysis',
							templateUrl : 'app/Operational/Defects/defectsdata.html'

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
								})

				.state('requirements',
						{
							url : '/requirements',
							title : 'Requirements',
							templateUrl : 'app/Operational/Requirements/requirementsmain.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/Operational/Requirements/RequirementsCtrl.js',
																'app/Operational/Requirements/ReqAnalyzeCtrl.js' ],
													});
										} ]
							}
						})

				.state('testcases',
						{
							url : '/testcases',
							title : 'Test Design',
							templateUrl : 'app/Operational/Design/testcases.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/Operational/Design/TestCasesCtrl.js',
																'app/Operational/Design/DesignAnalyzeCtrl.js',
																'app/Operational/Design/JiraTestCasesCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}
						})

				.state('testexecution',
						{
							url : '/testexecution',
							title : 'Test Execution',
							templateUrl : 'app/Operational/Execution/testexecution.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/Operational/Execution/JiraTestExecutionCtrl.js',
																'app/Operational/Execution/TestExecutionCtrl.js',
																'app/Operational/Execution/ExecutionAnalyzeCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}
						})

				.state(
						'defects',
						{
							url : '/defects',
							title : 'Defects',
							templateUrl : 'app/Operational/Defects/defectsdata.html',
							url : '/defects',
							title : 'Defects',
							templateUrl : 'app/Operational/Defects/defectsdata.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/Operational/Defects/defectsCtrl.js',
																'app/Operational/Defects/defectPopupDataCtrl.js',
																'app/Operational/Defects/defectsJiraCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}

						})

				.state(
						'defectEffProcurement',
						{
							url : '/defectEffProcurement',
							title : 'Tool Adoption',
							templateUrl : 'app/pages/defectProcurement/defectEfficiencyProcurement.html'

						})

				.state(
						'reqStabilityProcurement',
						{
							url : '/reqStabilityProcurement',
							title : 'Technical Dept',
							templateUrl : 'app/pages/charts/codeQualityData/codeQuality/codeQualityData.html'

						})

				.state(
						'modifyMetrics',
						{
							url : '/modifyMetrics',
							title : 'Modify Metrics',
							templateUrl : 'app/pages/custommetrics/addNewMetrics/modifyMetrics.html'

						})
				.state(
						'createMetrics',
						{
							url : '/createMetrics',
							title : 'Create Metrics',
							templateUrl : 'app/pages/custommetrics/addNewMetrics/createMetrics.html'

						})
						
				/*.state('register', 
						{
					url : '/register',
					title : 'SignUp',
					templateUrl : 'app/pages/login/register.html'

				})*/

				.state('admin',
						{
							url : '/admin',
							templateUrl : 'app/admin/admin.html',
							title : 'Admin',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/admin/AdminCtrl.js',
																'app/Operational/Home/operationalDashBoardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js',
																'lib/xeditable.js',
																'lib/xeditable.css',
																'lib/jspdf.debug.js' ],
													});
										} ]
							}
						}).state(
								'Operational',
								{
									url : '/Operational',
									directive : 'baSidebar',
									templateUrl : 'app/Operational/Home/operationalDashBoard.html',
									title : 'Operational Dashboard',
									resolve : {
										loadMyCtrl : [
												'$ocLazyLoad',
												function($ocLazyLoad) {
													return $ocLazyLoad
															.load({
																files : [
																		'app/Operational/Home/operationalDashBoardCtrl.js',
																		'lib/angularjs-dropdown-multiselect.js',
																		'lib/ui-bootstrap-tpls.js' ],
															});
												} ]
									}
								})
				

				
				.state('hpalmdetails', {
					url : '/hpalmdetails',
					templateUrl : 'app/pages/admin/hpalmDetails.html',
					title : 'HPALMDetails',
				})

				.state('toolSelect', {
					url : '/toolSelect',
					templateUrl : 'app/pages/admin/toolSelection.html',
					title : 'LifeCycle Layout Selection',
				})
				.state('editTemplateView', {
					url : '/editTemplateView',
					templateUrl : 'app/admin/templateCustomization/editTemplateView.html',
					title : ' Update Template ',
				})

				.state('customTemplateView', {
					url : '/customTemplateView',
					templateUrl : 'app/admin/templateCustomization/customTemplateView.html',
					title : ' View Template ',
				})

				.state(
						'templateCustomizationHome',
						{
							url : '/templateCustomizationHome',
							templateUrl : 'app/admin/templateCustomization/templateCustomizationHome.html',
							title : 'Template Customization',
						})

				.state('templateCustomization', {
					url : '/templateCustomization',
					templateUrl : 'app/admin/templateCustomization/templateCustomization.html',
					title : 'Template Customization',
				})

				.state('noaccess', {
					url : '/noaccess',
					templateUrl : 'app/pages/admin/noaccess.html',
					title : 'Admin',
				})

				.state('404', {
					url : '/404',
					title : '404',
					templateUrl : 'app/pages/login/error404.html'

				})

				.state(
						'userstoriesdetails',
						{
							url : '/userstoriesdetails',
							title : 'User Story',
							// templateUrl :
							// 'app/LifeCycle/lifecycle/userstories/userstoriesMain.html'
							templateUrl : 'app/Operational/UserStories/userstoriesMain.html'

						})

				.state(
						'userStoryDefectDetails',
						{
							url : '/userStoryDefectDetails',
							title : 'User Story Defect Details',
							templateUrl : 'app/LifeCycle/lifecycle/userstories/userstoriesdata/UserStoryDefectDetails.html'
						})

				.state(
						'userStoryTestDetails',
						{
							url : '/userStoryTestDetails',
							title : 'User Story Test Cases',
							templateUrl : 'app/LifeCycle/lifecycle/userstories/userstoriesdata/UserStoryTestCases.html'

						})

				.state('dashbotlanding', {
					url : '/dashbotlanding/:homeSearchTxt',
					title : 'Intelligent',
					templateUrl : 'app/QBot/qbot/qbotlanding.html',
					controller : 'qbotcontroller',
					resolve : {
						loadMyCtrl : [ '$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load({
								files : [ 'app/QBot/qbot/qbotcontroller.js', ],
							});
						} ]
					}
				})
				.state(
						'defineNewMetrics',
						{
							url : '/defineNewMetrics',
							title : 'Create New Metrics',
							templateUrl : 'app/pages/custommetrics/addNewMetrics/addWidgets.html'

						})
				.state(
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
