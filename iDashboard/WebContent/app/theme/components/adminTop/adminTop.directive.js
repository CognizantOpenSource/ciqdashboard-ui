/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('MetricsPortal.theme.components')
	.directive('adminTop', adminTop);

	/** @ngInject */
	function adminTop($location, $state, localStorageService) {
		return {
			restrict: 'E',
			templateUrl: 'app/theme/components/adminTop/adminTop.html',
			link: function($scope) {
				$scope.listvalue=false;
				$scope.adminvalue=false;
				$scope.operationalvalue=false;
				$scope.newdashboardvalue=false;
				$scope.globalvalue=false;
				$scope.dashboardvalue=false;
				$scope.lifecyclevalue=false;
				$scope.othervalue=false;
				$scope.lcdashboardvalue=false;
				$scope.lcmetricsvalue=false;
				$scope.value=false;
				$scope.riskMetric=false;
				$scope.$watch(function () {
					
					if($state.current.title=='Admin'|| $state.current.title=='HPALMDetails' || $state.current.title=='Tool Selection')

					{        		
						$scope.activePageTitle = $state.current.title;
						$scope.activeDashboardName = $state.current.title;
						$scope.adminvalue=true;
						$scope.operationalvalue=false;
						$scope.newdashboardvalue=false;
						$scope.globalvalue=false;
						$scope.dashboardvalue=false;
						$scope.lifecyclevalue=false;
						$scope.othervalue=false;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=false;
						$scope.value=false;
						$scope.riskMetric=false;
						$scope.listvalue=false;
					}
					else if($state.current.title=='Operational Dashboard' ||
							$state.current.title=='Update Dashboard' ||
							$state.current.title=='Create Dashboard'){
						$scope.activePageTitle = $state.current.title;
						$scope.activeDashboardName = $state.current.title;
						$scope.adminvalue=false;
						$scope.operationalvalue=true;
						$scope.newdashboardvalue=true;
						$scope.globalvalue=false;
						$scope.dashboardvalue=false;
						$scope.lifecyclevalue=false;
						$scope.othervalue=false;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=false;
						$scope.value=false;
						$scope.riskMetric=false;
						$scope.listvalue=false;

					}
					else if($state.current.title=='Global View')
					{       			
						$scope.activePageTitle = $state.current.title;
						$scope.activeDashboardName = localStorageService.get('dashboardName');
						$scope.adminvalue=false;
						$scope.operationalvalue=false;
						$scope.newdashboardvalue=false;
						$scope.globalvalue=true;
						$scope.dashboardvalue=false;
						$scope.lifecyclevalue=false;
						$scope.othervalue=false;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=false;
						$scope.value=false;
						$scope.riskMetric=false;
						$scope.listvalue=true;
					}
					else if($state.current.title=='Requirements' ||
							$state.current.title=='Test Design' ||
							$state.current.title=='Test Execution' ||
							$state.current.title=='Defects'||
							$state.current.title=='User Story')

					{        		
						$scope.activePageTitle = $state.current.title;
						$scope.dashboardName = localStorageService.get('dashboardName');
						$scope.activeDashboardName = localStorageService.get('projectName');
						$scope.adminvalue=false;
						$scope.operationalvalue=false;
						$scope.newdashboardvalue=false;
						$scope.globalvalue=false;
						$scope.dashboardvalue=true;
						$scope.lifecyclevalue=false;
						$scope.othervalue=false;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=false;
						$scope.value=true;
						$scope.riskMetric=false;
						$scope.listvalue=true;
					}
					else if($state.current.title=='Dashboard'||
							$state.current.title=='SlideShow')
					{
						$scope.activePageTitle = $state.current.title;
						$scope.dashboardName = localStorageService.get('dashboardName');
						$scope.activeDashboardName = localStorageService.get('projectName');
						$scope.adminvalue=false;
						$scope.listvalue=true;
						$scope.operationalvalue=false;
						$scope.newdashboardvalue=false;
						$scope.globalvalue=false;
						$scope.dashboardvalue=true;
						$scope.lifecyclevalue=false;
						$scope.othervalue=false;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=false;
						$scope.riskMetric=false;
						$scope.value=false;

					}
					else if($state.current.title=='Release Dashboard' ||
							$state.current.title=='Life Cycle View' ||
							$state.current.title=='Create LifeCycle Dashboard'||
							$state.current.title=='LifeCycle Dashboard'||
							$state.current.title=='Release Dashboards'||
							$state.current.title=='DEVOPS KPI Dashboard')
					{       			
						$scope.activePageTitle = $state.current.title;
						$scope.activeDashboardName = localStorageService.get('dashboardName');
						$scope.adminvalue=false;
						$scope.operationalvalue=false;
						$scope.newdashboardvalue=false;
						$scope.globalvalue=false;
						$scope.dashboardvalue=false;
						$scope.lifecyclevalue=true;
						$scope.othervalue=false;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=false;
						$scope.value=false;
						$scope.riskMetric=false;
						$scope.listvalue=false;
					}
					else if($state.current.title=='LC Dashboard' ||
							$state.current.title=='Code Repository' ||
							$state.current.title=='Builds' ||
							$state.current.title=='Chef Node Details' )
					{       			
						$scope.activePageTitle = $state.current.title;
						$scope.activeDashboardName = localStorageService.get('dashboardName');
						$scope.adminvalue=false;
						$scope.operationalvalue=false;
						$scope.newdashboardvalue=false;
						$scope.globalvalue=false;
						$scope.dashboardvalue=false;
						$scope.lifecyclevalue=false;
						$scope.othervalue=false;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=true;
						$scope.value=false;
						$scope.riskMetric=false;
						$scope.listvalue=true;
					}

					else if($state.current.title=='Code Analysis' ||
							$state.current.title=='Build Metrics' ||
							$state.current.title=='Test Management Metrics'||
							$state.current.title=='SCM Dashboard' ||
							$state.current.title=='Chef Run Details' ||
							$state.current.title=='User Story Life Cycle')
					{
						$scope.activePageTitle = $state.current.title;
						$scope.activeDashboardName = localStorageService.get('dashboardName');
						$scope.adminvalue=false;
						$scope.operationalvalue=false;
						$scope.newdashboardvalue=false;
						$scope.globalvalue=false;
						$scope.dashboardvalue=false;
						$scope.lifecyclevalue=false;
						$scope.othervalue=false;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=true;
						$scope.riskMetric=false;
						$scope.value=false;
						$scope.listvalue=true;

					}
				else if($state.current.title=='QI BOTS Dashboard' ||
							$state.current.title=='iDashboard' ||
							$state.current.title=='Smart Stub Dashboard'||
							
							$state.current.title=='ADPART  Dashboard' ||
							$state.current.title=='Automation Dashboard' || 
								$state.current.title=='IOT Dashboard' ||
								$state.current.title=='TDM Dashboard' ||
								$state.current.title=='Overdue Risks By Category' ||
								$state.current.title=='Due In 60 days by Risk Category /Division' ||
								$state.current.title=='Risks By Division' ||
								$state.current.title=='Risks by Status' ||
								$state.current.title=='Archers Critical High by Division' ||
								$state.current.title=='Ethical Hack Critical,High & Medium by Division' || 
								$state.current.title=='Network Penetration by Severity'
									)
					{
						$scope.activePageTitle = $state.current.title;
						$scope.activeDashboardName = localStorageService.get('dashboardName');
						$scope.adminvalue=false;
						$scope.operationalvalue=false;
						$scope.newdashboardvalue=false;
						$scope.globalvalue=false;
						$scope.dashboardvalue=false;
						$scope.lifecyclevalue=false;
						$scope.othervalue=false;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=false;
						$scope.riskMetric=true;
						$scope.value=false;
						$scope.listvalue=false;

					}
				
					else if ($state.current.title=='SlideShow PopUp')
					{
				
						//$scope.activePageTitle = $state.current.title;
						//$scope.activeDashboardName = $state.current.title;
						$scope.adminvalue=false;
						$scope.operationalvalue=false;
						$scope.newdashboardvalue=false;
						$scope.globalvalue=false;
						$scope.dashboardvalue=false;
						$scope.lifecyclevalue=false;
						$scope.othervalue=true;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=false;
						$scope.value=false;
						$scope.riskMetric=false;
						$scope.listvalue=false;


					}   else {
						$scope.activePageTitle = $state.current.title;
						$scope.activeDashboardName = $state.current.title;
						$scope.adminvalue=false;
						$scope.operationalvalue=false;
						$scope.newdashboardvalue=false;
						$scope.globalvalue=false;
						$scope.dashboardvalue=false;
						$scope.lifecyclevalue=false;
						$scope.othervalue=true;
						$scope.lcdashboardvalue=false;
						$scope.lcmetricsvalue=false;
						$scope.value=false;
						$scope.riskMetric=false;
						$scope.listvalue=false;
					}
						
				});
			}
		};
	}

})();