/**
 * @author v.lugovsky created on 16.12.2015
 */
(function() {
	'use strict';

	angular
			.module(
					'MetricsPortal.pages',
					[ 'ui.router', 'MetricsPortal.pages.dashboard',
							'MetricsPortal.pages.reportData',
							'MetricsPortal.pages.charts',
							   'MetricsPortal.pages.riskCompliance',
							'MetricsPortal.pages.login' ]).config(routeConfig);

	/** @ngInject */
	function routeConfig($urlRouterProvider, baSidebarServiceProvider,
			$stateProvider, $routeProvider) {

		$stateProvider
				.state('createUser', {
					url : '/createUser',

					templateUrl : 'app/pages/admin/createUser.html',
					title : 'Create New User',

				})
				.state(
						'defectDataProcurement',
						{
							url : '/defectDataProcurement',
							title : 'Defect Analysis',
							templateUrl : 'app/pages/charts/defects/defectsdata/defectsdata.html'

						})

				.state('requirements',
						{
							url : '/requirements',
							title : 'Requirements',
							templateUrl : 'app/pages/charts/requirements/requirementsmain.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/pages/charts/requirements/requirementsdata/RequirementsCtrl.js',
																'app/pages/charts/requirements/requirementsdata/ReqAnalyzeCtrl.js' ],
													});
										} ]
							}
						})

				.state('testcases',
						{
							url : '/testcases',
							title : 'Test Design',
							templateUrl : 'app/pages/charts/testcases/testcasesdata/testcases.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/pages/charts/testcases/testcasesdata/TestCasesCtrl.js',
																'app/pages/charts/testcases/testcasesdata/DesignAnalyzeCtrl.js',
																'app/pages/charts/testcases/testcasesdata/JiraTestCasesCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}
						})

				.state('testexecution',
						{
							url : '/testexecution',
							title : 'Test Execution',
							templateUrl : 'app/pages/charts/testexecution/testexecution.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/pages/charts/testexecution/testexecutiondata/JiraTestExecutionCtrl.js',
																'app/pages/charts/testexecution/testexecutiondata/TestExecutionCtrl.js',
																'app/pages/charts/testexecution/testexecutiondata/ExecutionAnalyzeCtrl.js',
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
							templateUrl : 'app/pages/charts/defects/defectsdata/defectsdata.html',
							url : '/defects',
							title : 'Defects',
							templateUrl : 'app/pages/charts/defects/defectsdata/defectsdata.html',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/pages/charts/defects/defectsdata/defectsCtrl.js',
																'app/pages/charts/defects/defectsdata/defectPopupDataCtrl.js',
																'app/pages/charts/defects/defectsdata/defectsJiraCtrl.js',
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
						
				.state('register', 
						{
					url : '/register',
					title : 'SignUp',
					templateUrl : 'app/pages/login/register.html'

				})

				.state('admin',
						{
							url : '/admin',
							templateUrl : 'app/pages/admin/admin.html',
							title : 'Admin',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/pages/admin/AdminCtrl.js',
																'app/pages/operational/operationalDashBoardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js',
																'lib/xeditable.js',
																'lib/xeditable.css',
																'lib/jspdf.debug.js' ],
													});
										} ]
							}
						})
				.state(
						'operationalDashBoard',
						{
							url : '/operationalDashBoard',
							directive : 'baSidebar',
							templateUrl : 'app/pages/operational/operationalDashBoard.html',
							title : 'Operational Dashboard',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/pages/operational/operationalDashBoardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js',
																'lib/ui-bootstrap-tpls.js'],
													});
										} ]
							}
						})

				.state(
						'createDashbaordOperational',
						{
							url : '/createDashbaordOperational',
							directive : 'baSidebar',
							templateUrl : 'app/pages/operational/createOperationalDashboard.html',
							title : 'Create Dashboard',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/pages/operational/operationalDashBoardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}
						})

				.state(
						'viewDashbaordOperational',
						{
							url : '/viewDashbaordOperational',
							directive : 'baSidebar',
							templateUrl : 'app/pages/operational/viewOperationalDashboard.html',
							title : 'Update Dashboard',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/pages/operational/operationalDashBoardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}
						})

				.state(
						'globalview',
						{
							url : '/globalview',
							directive : 'baSidebar',
							templateUrl : 'app/pages/operational/globalView.html',
							title : 'Global View',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/pages/operational/operationalDashBoardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
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
					templateUrl : 'app/pages/admin/editTemplateView.html',
					title : ' Update Template ',
				})

				.state('customTemplateView', {
					url : '/customTemplateView',
					templateUrl : 'app/pages/admin/customTemplateView.html',
					title : ' View Template ',
				})

				.state(
						'templateCustomizationHome',
						{
							url : '/templateCustomizationHome',
							templateUrl : 'app/pages/admin/templateCustomizationHome.html',
							title : 'Template Customization',
						})

				.state('templateCustomization', {
					url : '/templateCustomization',
					templateUrl : 'app/pages/admin/templateCustomization.html',
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
							templateUrl : 'app/pages/charts/userstories/userstoriesMain.html'

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
							templateUrl : 'app/pages/operational/SummarySlideShow/Summaryslideshowpopup.html',
							title : '',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'lib//jquery.easing.js',
																'app/pages/operational/SummarySlideShow/SummaryslideShowCtrl.js' ],
													});
										} ]
							}

						});
	}

})();
