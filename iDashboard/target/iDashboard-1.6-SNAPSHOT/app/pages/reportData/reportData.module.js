/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.reportData', [
    'ui.router'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider,$stateProvider,$routeProvider) { 
      $stateProvider 
      /*state('reportdata', {
          url: '/reportdata',
          
          templateUrl: 'app/pages/reportData/reportData.html',
          controller:'LoginCtrl',
          
          title: 'Report Data'
          
   
        })*/
      .state('internalreport', {
          url: '/internalreport',
          directive:'baSidebar',
          templateUrl: 'app/pages/reportData/internalReport.html',
          title: 'Internal Report',
          resolve : {
				loadMyCtrl : [ '$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						files : [ 'app/pages/reportData/reportDataCtrl.js' ],
					});
				} ]
			}
        })
        
      .state('reportdata', {
        url: '/reportdata',
        directive:'baSidebar',
        templateUrl: 'app/pages/reportData/reportData.html',
        controller:'reportDataCtrl',
        title: 'Report Data',
      /*  sidebarMeta: {
            icon: 'ion-android-home',
            order: 0,
          }, */
      })
      
      
       
    /*  .state('verticalcharts', {
          url: '/verticalcharts',
          directive:'baSidebar',
          templateUrl: 'app/pages/reportData/verticalCharts.html',
          controller:'reportDataCtrl',
          title: ' Vertical wise Split up',
          sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, 
        })
        
       
      .state('activitychart', {
          url: '/activitychart',
          directive:'baSidebar',
          templateUrl: 'app/pages/reportData/activityChart.html',
          controller:'reportDataCtrl',
          title: ' Activity wise Split up',
          sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, 
        })
        
        .state('capabilityreportchart', {
          url: '/capabilityreportchart',
          directive:'baSidebar',
          templateUrl: 'app/pages/reportData/capabilityReportChart.html',
          controller:'reportDataCtrl',
          title: 'Capability wise Split up',
          sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, 
        })
         .state('impressionChart', {
          url: '/impressionChart',
          directive:'baSidebar',
          templateUrl: 'app/pages/reportData/impressionChart.html',
          controller:'reportDataCtrl',
          title: 'Contribution wise Split up',
          sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, 
        })*/
        
         .state('coEChartView', {
          url: '/coEChartView',
          directive:'baSidebar',
          templateUrl: 'app/pages/reportData/coEChartView.html',
          controller:'reportDataCtrl',
          title: 'CoEDashboard View',
        /*  sidebarMeta: {
              icon: 'ion-android-home',
              order: 0,
            }, */
        })
  
  }

})();
