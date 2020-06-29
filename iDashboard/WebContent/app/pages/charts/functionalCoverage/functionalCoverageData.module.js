/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.charts.functionalCoverage', []).config(
			routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
				.state(
						'charts.functionalCoverage',
						{
							url : '/functionalCoverageData',
							templateUrl : 'app/pages/charts/functionalCoverage/functionalCoverageData.html',
							sidebarMeta : {
								order : 0,
							},
						});
		
	}
	


})();
