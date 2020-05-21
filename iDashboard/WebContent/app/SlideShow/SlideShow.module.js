/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.SlideShow', ['ui.router'])
                                               .config(routeConfig);
  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    
    .state('slideshow', {
        url: '/slideshow',
        directive:'baSidebar',
        templateUrl:'app/SlideShow/slideshow.html',
        title: 'SlideShow',
        resolve : {
			loadMyCtrl : [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad
								.load({
									files : [
											'app/SlideShow/slideShowCtrl.js',
											'app/pages/charts/requirements/requirementsdata/RequirementsCtrl.js',
											'app/pages/charts/testcases/testcasesdata/TestCasesCtrl.js',
											'app/pages/charts/testexecution/testexecutiondata/TestExecutionCtrl.js',
											'app/pages/charts/defects/defectsdata/defectsCtrl.js'],
								});
					} ]
		},
    	sidebarMeta : {
			icon : 'ion-monitor',
			order : 150,
		},
    
      });
  }

})();
