/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.RiskCompliance', [
    'ui.router','chart.js'])
      .config(routeConfig).config(chartJsConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider,$stateProvider,$routeProvider) { 
      $stateProvider 
     
      .state('riskCompliance', {
          url: '/riskCompliance',
          directive:'baSidebar',
          templateUrl: 'app/CustomMetrics/RiskCompliance/riskCompliance.html',
          title: 'Open Risks',
          resolve : {
				loadMyCtrl : [ '$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						files : [ 'app/CustomMetrics/RiskCompliance/riskComplianceCtrl.js' ],
					});
				} ]
			}
        })
        
      .state('riskCompliancedata', {
        url: '/riskCompliancedata',
        directive:'baSidebar',
        templateUrl: 'app/CustomMetrics/RiskCompliance/riskComplianceData.html',
        controller:'riskComplianceCtrl',
        title: 'Open Risks',
      /*  sidebarMeta: {
            icon: 'ion-android-home',
            order: 0,
          }, */
      })
      
      .state('overdueRisksByCategory', {
          url: '/overdueRisksByCategory',
          directive:'baSidebar',
          templateUrl: 'app/CustomMetrics/RiskCompliance/overdueRisksByCategory.html',
          controller:'riskComplianceCtrl',
          title: 'Overdue Risks By Category',
        /*  sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, */
        })
        
       
        .state('dueInRiskCategoryOrDivision', {
          url: '/dueInRiskCategoryOrDivision',
          directive:'baSidebar',
          templateUrl: 'app/CustomMetrics/RiskCompliance/dueInRiskCategoryOrDivision.html',
          controller:'riskComplianceCtrl',
          title: 'Due In 60 days by Risk Category /Division',
        /*  sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, */
        })
         
         .state('riskByDivision', {
          url: '/riskByDivision',
          directive:'baSidebar',
          templateUrl: 'app/CustomMetrics/RiskCompliance/riskByDivision.html',
          controller:'riskComplianceCtrl',
          title: 'Risks By Division',
        /*  sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, */
        })
        
         .state('qualysVulnerabilitiesByDivision', {
          url: '/qualysVulnerabilitiesByDivision',
          directive:'baSidebar',
          templateUrl: 'app/CustomMetrics/RiskCompliance/qualysVulnerabilitiesByDivision.html',
          controller:'riskComplianceCtrl',
          title: 'Qualys Vulnerabilities By Division',
        /*  sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, */
        })
        
        .state('retiredAppsOpenRisksbyDivision', {
          url: '/retiredAppsOpenRisksbyDivision',
          directive:'baSidebar',
          templateUrl: 'app/CustomMetrics/RiskCompliance/retiredAppsOpenRisksbyDivision.html',
          controller:'riskComplianceCtrl',
          title: 'Retired Apps Open Risks by Division',
        /*  sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, */
        })
      
        .state('archersbyStatus', {
            url: '/archersbyStatus',
            directive:'baSidebar',
            templateUrl: 'app/CustomMetrics/RiskCompliance/archersbyStatus.html',
            controller:'riskComplianceCtrl',
            title: 'Risks by Status',
          /*  sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, */
          })
          .state('archersDependentOnVendors', {
            url: '/archersDependentOnVendors',
            directive:'baSidebar',
            templateUrl: 'app/CustomMetrics/RiskCompliance/archersDependentOnVendors.html',
            controller:'riskComplianceCtrl',
            title: 'archers Dependent On Vendors',
          /*  sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, */
          })
        .state('archersCriticalHighbyDivision', {
            url: '/archersCriticalHighbyDivision',
            directive:'baSidebar',
            templateUrl: 'app/CustomMetrics/RiskCompliance/archersCriticalHighbyDivision.html',
            controller:'riskComplianceCtrl',
            title: 'Archers Critical High by Division',
          /*  sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, */
          })
   .state('ethicalHackFindingsbyStatus', {
            url: '/ethicalHackFindingsbyStatus',
            directive:'baSidebar',
            templateUrl: 'app/CustomMetrics/RiskCompliance/ethicalHackFindingsbyStatus.html',
            controller:'riskComplianceCtrl',
            title: 'Ethical Hack Findings by Status',
          /*  sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, */
          })
           /* .state('ethicalHackFindingsbyDivision', {
            url: '/ethicalHackFindingsbyDivision',
            directive:'baSidebar',
            templateUrl: 'app/pages/riskCompliance/ethicalHackFindingsbyDivision.html',
            controller:'riskComplianceCtrl',
            title: 'Ethical Hack Findings by Division',
            sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, 
          })*/
              .state('ethicalHackCriticalHighMediumbyDivision', {
            url: '/ethicalHackCriticalHighMediumbyDivision',
            directive:'baSidebar',
            templateUrl: 'app/CustomMetrics/RiskCompliance/ethicalHackCriticalHighMediumbyDivision.html',
            controller:'riskComplianceCtrl',
            title: 'Ethical Hack Critical,High & Medium by Division',
          /*  sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, */
          })
            .state('networkPenetrationCriticalHighMediumbyDivision', {
            url: '/networkPenetrationCriticalHighMediumbyDivision',
            directive:'baSidebar',
            templateUrl: 'app/CustomMetrics/RiskCompliance/networkPenetrationCriticalHighMediumbyDivision.html',
            controller:'riskComplianceCtrl',
            title: 'Network Penetration Critical High Medium by Division',
          /*  sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, */
          })
            /*.state('networkPenetrationbyDivision', {
            url: '/networkPenetrationbyDivision',
            directive:'baSidebar',
            templateUrl: 'app/pages/riskCompliance/networkPenetrationbyDivision.html',
            controller:'riskComplianceCtrl',
            title: 'Network Penetration by Division',
            sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, 
          })*/
           .state('networkPenetrationbySeverity', {
            url: '/networkPenetrationbySeverity',
            directive:'baSidebar',
            templateUrl: 'app/CustomMetrics/RiskCompliance/networkPenetrationbySeverity.html',
            controller:'riskComplianceCtrl',
            title: 'Network Penetration by Severity',
          /*  sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, */
          })
          .state('riskRegisterIssues', {
            url: '/riskRegisterIssues',
            directive:'baSidebar',
            templateUrl: 'aapp/CustomMetrics/RiskCompliance/riskRegisterIssues.html',
            controller:'riskComplianceCtrl',
            title: 'Risk Register Issues',
          /*  sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, */
          })
                    .state('cyberSecurityAdoptionTracks', {
            url: '/cyberSecurityAdoptionTracks',
            directive:'baSidebar',
            templateUrl: 'app/CustomMetrics/RiskCompliance/cyberSecurityAdoptionTracks.html',
            controller:'riskComplianceCtrl',
            title: 'Cyber Security Adoption Tracks',
          /*  sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              }, */
          })
          .state(
						'usAgengyTrendOpenRisks',
						{
							url : '/usAgengyTrendOpenRisks',
							
							templateUrl : 'app/CustomMetrics/RiskCompliance/usAgengyTrendOpenRisks.html',
							title : 'IOT Dashboard',

						})
  
  .state(
			'subAccountingTrendOpenRisk',
			{
				url : '/subAccountingTrendOpenRisk',
				
				templateUrl : 'app/CustomMetrics/RiskCompliance/subAccountingTrendOpenRisk.html',
				title : 'QI BOTS Dashboard',

			})
			 .state(
			'onCoreTrendOpenRisks',
			{
				url : '/onCoreTrendOpenRisks',
				
				templateUrl : 'app/CustomMetrics/RiskCompliance/onCoreTrendOpenRisks.html',
					title : 'iDashboard',
			})
			.state(
			'alternativeInvestmentTrendOpenRisks',
			{
				url : '/alternativeInvestmentTrendOpenRisks',
			
				templateUrl : 'app/CustomMetrics/RiskCompliance/alternativeInvestmentTrendOpenRisks.html',
				title : 'Smart Stub Dashboard',

			})
			.state(
			'giarsTrendOpenRisks',
			{
				url : '/giarsTrendOpenRisks',
			
				templateUrl : 'app/CustomMetrics/RiskCompliance/giarsTrendOpenRisks.html',
				title : 'ADPART  Dashboard',

			})
			.state(
			'emeaTrendOpenRisks',
			{
				url : '/emeaTrendOpenRisks',
				
				templateUrl : 'app/CustomMetrics/RiskCompliance/emeaTrendOpenRisks.html',
					title : 'Automation Dashboard',
			})
			.state(
			'globalFundTrendOpenRisks',
			{
				url : '/globalFundTrendOpenRisks',
				
				templateUrl : 'app/CustomMetrics/RiskCompliance/globalFundTrendOpenRisks.html',
				title : 'TDM Dashboard ',

			})
			
			.state(
					'detailsEthicalData',
					{
						url : '/detailsEthicalData',
						
						templateUrl : 'app/CustomMetrics/RiskCompliance/detailsEthicalData.html',
						title : 'Ethical Details ',

					})
			.state(
					'qualysDetailsData',
					{
						url : '/qualysDetailsData',
						
						templateUrl : 'app/CustomMetrics/RiskCompliance/qualysDetailsData.html',
						title : 'Qualys-Vulnerability Details ',

					})
					.state(
					'networkDetailsData',
					{
						url : '/networkDetailsData',
						
						templateUrl : 'app/CustomMetrics/RiskCompliance/networkDetailsData.html',
						title : 'Network-Penetration  Details ',

					})
					
					.state(
							'archerDetailsData',
							{
								url : '/archerDetailsData',
								
								templateUrl : 'app/CustomMetrics/RiskCompliance/archerDetailsData.html',
								title : 'Archer  Details ',

							})
}
  
  function chartJsConfig(ChartJsProvider, baConfigProvider) {
      var layoutColors = baConfigProvider.colors;
      // Configure all charts
      ChartJsProvider.setOptions({
          chartColors: [
              layoutColors.primary, layoutColors.danger, layoutColors.warning, layoutColors.success, layoutColors.info, layoutColors.default, layoutColors.primaryDark, layoutColors.successDark, layoutColors.warningLight, layoutColors.successLight, layoutColors.primaryLight],
          responsive: true,
          maintainAspectRatio: false,
          animation: {
              duration: 2500
          },
          scale: {
              gridLines: {
                  color: layoutColors.border
              },
              scaleLabel: {
                  fontColor: layoutColors.defaultText
              },
              ticks: {
                  fontColor: layoutColors.defaultText,
                  showLabelBackdrop: false
              }
          }
      });
      // Configure all line charts
      ChartJsProvider.setOptions('Line', {
          datasetFill: false
      });
      // Configure all radar charts
      ChartJsProvider.setOptions('radar', {
          scale: {
              pointLabels: {
                  fontColor: layoutColors.defaultText
              },
              ticks: {
                  maxTicksLimit: 5,
                  display: false
              }
          }
      });
      // Configure all bar charts
      ChartJsProvider.setOptions('bar', {
          tooltips: {
              enabled: false
          }
      });
  }

})();
